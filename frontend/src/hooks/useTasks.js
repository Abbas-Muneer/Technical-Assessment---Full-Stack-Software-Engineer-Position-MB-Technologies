import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { completeTask, createTask, fetchTasks } from '../api/taskApi';

const TASKS_QUERY_KEY = ['tasks'];

export function useTasks() {
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: fetchTasks
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (createdTask) => {
      queryClient.setQueryData(TASKS_QUERY_KEY, (currentTasks = []) => {
        const nextTasks = [createdTask, ...currentTasks].filter((task) => task.status === 'PENDING');
        return nextTasks.slice(0, 5);
      });
    }
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeTask,
    onSuccess: (_, taskId) => {
      queryClient.setQueryData(TASKS_QUERY_KEY, (currentTasks = []) =>
        currentTasks.filter((task) => task.id !== taskId)
      );
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    }
  });
}

