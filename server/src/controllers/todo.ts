import { RequestHandler } from "express";
import { Todo } from "../entities/Todo";
import { GlobalError } from "./error";

interface AddTodoRequestBody {
  content: string;
}

export const listTodos: RequestHandler = async (_req, res, next) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    next(err);
  }
};

export const addTodo: RequestHandler = async (req, res, next) => {
  const { content } = req.body as AddTodoRequestBody;

  try {
    if (content.length === 0) {
      throw new GlobalError(400, "Content cannot be empty");
    }

    const todo = await Todo.create({
      content,
    }).save();

    res.json(todo);
  } catch (err) {
    next(err);
  }
};
