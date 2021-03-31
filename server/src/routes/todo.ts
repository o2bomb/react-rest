import express from "express";
import { addTodo, listTodos } from "../controllers/todo";

const router = express.Router();

router.post("/add", addTodo);
router.get("/list", listTodos);

export default router;