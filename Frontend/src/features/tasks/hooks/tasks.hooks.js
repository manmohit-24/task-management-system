import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, updateTask, toggleTask } from "../api/tasks.service";

// ===== Get Today =====

export function useTodayPageTasks() {
    const queryClient = useQueryClient();

    // Invalidate on midnight
    useEffect(() => {
        const now = new Date();

        const nextMidnight = new Date(now);
        nextMidnight.setHours(24, 0, 0, 0);

        const msUntilMidnight = nextMidnight.getTime() - now.getTime();

        const timer = setTimeout(() => {
            queryClient.invalidateQueries({
                queryKey: ["today"],
            });
        }, msUntilMidnight);

        return () => clearTimeout(timer);
    }, [queryClient]);

    return useQuery({
        queryKey: ["today"],

        queryFn: async () => {
            const [overdueRes, todayRes] = await Promise.all([
                getTasks({ dueDate: "overdue" }),
                getTasks({ dueDate: "today" }),
            ]);

            return {
                overdue: overdueRes.success ? overdueRes.data : [],
                today: todayRes.success ? todayRes.data : [],
            };
        },

        retry: false,
        staleTime: 10_000,
    });
}

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

            // priority based sorting
            return [...res.data].sort((a, b) => a.priority - b.priority);
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

            // Invalidations
            queryClient.invalidateQueries({
                queryKey: ["tasks", { project, section, parentId }],
            });

            queryClient.invalidateQueries({
                queryKey: ["today"],
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

            // Invalidations
            queryClient.invalidateQueries({
                queryKey: ["tasks", { project, section, parentId }],
            });

            queryClient.invalidateQueries({
                queryKey: ["today"],
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

            // Invalidations
            queryClient.invalidateQueries({
                queryKey: ["tasks", { project, section, parentId }],
            });

            queryClient.invalidateQueries({
                queryKey: ["today"],
            });

            options?.onSuccess?.(data, variables, context);
        },

        onError: (...args) => {
            options?.onError?.(...args);
        },
    });
}
