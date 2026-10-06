import { useQuery } from "@tanstack/react-query";
import { addSegment, addTodo, getSegments, getTodos } from "./api";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../lib/queryClient";

const segmentsKey = "segements";
const todosKey = "todos";

export function useSegments() {
  return useQuery({
    queryKey: [segmentsKey],
    queryFn: getSegments,
  });
}

export function useAddSegment() {
  return useMutation({
    mutationFn: addSegment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [segmentsKey] }),
  });
}

export function useTodos() {
  return useQuery({
    queryKey: [todosKey],
    queryFn: getTodos,
  });
}

export function useAddTodo() {
  return useMutation({
    mutationFn: addTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [todosKey] }),
  });
}
