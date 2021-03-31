import axios from "redaxios";
import useSWR, { mutate } from "swr";
import fetcher from "./fetcher";

interface Todo {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AddTodoRequestBody {
  content: string;
}

export const todoApiEndpoint = `${process.env.NEXT_PUBLIC_SERVER_URL}/todo`;

export const listTodos = () => {
  return useSWR<Todo[]>(`${todoApiEndpoint}/list`, fetcher);
}

export const addTodo = (body: AddTodoRequestBody) => {
  return axios.post<Todo>(`${todoApiEndpoint}/add`, body);
}
