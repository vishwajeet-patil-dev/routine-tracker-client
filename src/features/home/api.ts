import { api } from "../../lib/http";
import type { ApiResponse } from "../../lib/types";
import type { Segment, Todo } from "./types";

export async function getSegments(): Promise<Segment[]> {
  const { data } = await api.get<ApiResponse<Segment[]>>("/get-segments");
  return data;
}

export async function addSegment(input: Segment) {
  await api.post<{ message: string }>("/add-segment", input);
}

export async function addTodo(input: Todo) {
  await api.post<{ message: string }>("/add-todo", input);
}

export async function getTodos(): Promise<Todo[]> {
  const { data } = await api.get<ApiResponse<Todo[]>>("/get-todos");
  return data;
}
