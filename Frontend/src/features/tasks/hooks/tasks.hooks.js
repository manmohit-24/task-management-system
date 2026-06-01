import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, updateTask, toggleTask } from "../api/tasks.service";

// ===== Get Tasks =====
export function useTasks({ project, section, parentId }) {
    return useQuery({
        queryKey: ["tasks", { project, section, parentId }],

        queryFn: async () => {
            const res = await getTasks({
                project,
                section,
                parentId,
            });

            if (!res.success) return { data: [] };

            return res.data;
        },

        retry: false,
        staleTime: 10_000,
    });
}

// ===== Create Task =====
export function useCreateTask(options = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTask,

        onSuccess: (data, variables, context) => {
            const { project, section, parentId } = variables;

            queryClient.invalidateQueries({
                queryKey: ["tasks", { project, section, parentId }],
            });

            options?.onSuccess?.(data, variables, context);
        },

        onError: (...args) => {
            options?.onError?.(...args);
        },
    });
}
// ===== Update Task =====
export function useUpdateTask(options = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateTask,

        onSuccess: (data, variables, context) => {
            const { project, section, parentId } = variables;
            console.log(variables);

            queryClient.invalidateQueries({
                queryKey: ["tasks", { project, section, parentId }],
            });

            options?.onSuccess?.(data, variables, context);
        },

        onError: (...args) => {
            options?.onError?.(...args);
        },
    });
}
// ===== Toggle Task Completition =====
export function useToggleTask(options = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleTask,

        onSuccess: (data, variables, context) => {
            const { project, section, parentId } = variables;
            queryClient.invalidateQueries({
                queryKey: ["tasks", { project, section, parentId }],
            });

            options?.onSuccess?.(data, variables, context);
        },

        onError: (...args) => {
            options?.onError?.(...args);
        },
    });
}
