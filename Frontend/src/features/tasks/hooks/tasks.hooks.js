import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, getTaskById, createTask, toggleTask } from "../api/tasks.service";

//Get tasks
export function useTasks({ projectId, sectionId, parentTaskId }) {
    return useQuery({
        queryKey: ["tasks", "list", { projectId, sectionId, parentTaskId }],

        queryFn: async () => {
            console.log({
                projectId,
                sectionId,
                parentTaskId,
            });
            const res = await getTasks({
                projectId,
                sectionId,
                parentTaskId,
            });

            if (!res.success) return { data: [] };

            return res.data;
        },

        retry: false,
        staleTime: 10_000,
    });
}

// Get details of a single task
export function useTaskById(id) {
    return useQuery({
        queryKey: ["tasks", "detail", id],

        queryFn: async () => {
            const res = await getTaskById({ id });

            if (!res.success) return null;

            return res.data;
        },

        retry: false,
        staleTime: 10_000,
    });
}

// Get details of a single task with subtasks
export function useTaskWithSubtasks({ id, projectId, sectionId }) {
    const taskQuery = useTaskById(id);

    const subtasksQuery = useTasks({
        projectId,
        sectionId,
        parentTaskId: id,
    });

    return {
        task: taskQuery.data
            ? {
                  ...taskQuery.data,
                  subtasks: subtasksQuery.data ?? [],
              }
            : null,

        isLoading: taskQuery.isLoading || subtasksQuery.isLoading,

        isError: taskQuery.isError || subtasksQuery.isError,

        taskQuery,
        subtasksQuery,
    };
}

// Create task
export function useCreateTask(options = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTask,

        onSuccess: (data, variables, context) => {
            const { projectId, sectionId, parentTaskId } = variables;

            queryClient.invalidateQueries({
                queryKey: ["tasks", "list", { projectId, sectionId, parentTaskId }],
            });

            options?.onSuccess?.(data, variables, context);
        },

        onError: (...args) => {
            options?.onError?.(...args);
        },
    });
}

// Toggle task
export function useToggleTask(options = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleTask,

        onSuccess: (data, variables, context) => {
            const { projectId, sectionId, parentTaskId, id } = variables;

            void Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["tasks", "list", { projectId, sectionId, parentTaskId }],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["tasks", "detail", id],
                }),
            ]);

            options?.onSuccess?.(data, variables, context);
        },

        onError: (...args) => {
            options?.onError?.(...args);
        },
    });
}
