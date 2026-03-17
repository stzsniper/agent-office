import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getActivityFeed,
  getTasks,
  createTask,
  updateTask,
  getTaskStats,
  type AgentTask,
  type ActivityItem,
} from '@/lib/insforge';

export function useActivityFeed(limit = 50, agent?: string) {
  return useQuery({
    queryKey: ['activity-feed', agent, limit],
    queryFn: async () => {
      const { data, error } = await getActivityFeed(limit, agent);
      if (error) throw new Error(error.message);
      return data as ActivityItem[];
    },
    refetchInterval: 15000, // 15s auto-refresh
  });
}

export function useTasks(limit = 50, status?: string) {
  return useQuery({
    queryKey: ['agent-tasks', status, limit],
    queryFn: async () => {
      const { data, error } = await getTasks(limit, status);
      if (error) throw new Error(error.message);
      return data as AgentTask[];
    },
    refetchInterval: 10000,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: Omit<AgentTask, 'id' | 'created_at'>) => {
      const { data, error } = await createTask(task);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-tasks'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AgentTask> }) => {
      const { data, error } = await updateTask(id, updates);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-tasks'] });
    },
  });
}

export function useTaskStats() {
  return useQuery({
    queryKey: ['task-stats'],
    queryFn: async () => {
      const { data, error } = await getTaskStats();
      if (error) throw new Error(error.message);
      return data as AgentTask[];
    },
    refetchInterval: 60000,
  });
}
