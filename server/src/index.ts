import "dotenv-safe/config";
import connectRedis from "connect-redis";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import path from "path";
import cors from "cors";
import { createConnection } from "typeorm";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Todo } from "./entities/Todo";
import todoRoutes from "./routes/todo";
import { globalErrorHandler } from "./controllers/error";

const main = async () => {
  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: !__prod__, // makes sure entities are synced with database. dont use in prod
    entities: [Todo],
    migrations: [path.join(__dirname, "./migrations/*")],
  });
  // await conn.runMigrations();

  const app = express();

  // COOKIES
  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);
  app.set("trust proxy", 1);
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }) as session.Store,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // lasts 10 years
        httpOnly: true,
        sameSite: "lax",
        domain: __prod__ ? process.env.COOKIE_DOMAIN : undefined,
        secure: __prod__, // cookie only works in https (in prod)
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  // CORS
  const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  };
  app.use(cors(corsOptions));
  app.use(express.json());

  // ROUTES
  app.get("/hello", (_, res) => res.send("Hello World!"));
  app.use("/todo", todoRoutes);

  // ERROR HANDLING
  app.use(globalErrorHandler);

  // if (process.env.NODE_ENV === "production") {
  //   app.use("/", express.static(path.join(__dirname, "..", "client", "dist")));
  //   app.use("/public", express.static(path.join(__dirname, "..", "client", "public")));
  // }

  app.listen(parseInt(process.env.PORT), () => {
    console.log("Express server started on port", process.env.PORT);
  });
};

main().catch((error) => {
  console.error(error);
});
