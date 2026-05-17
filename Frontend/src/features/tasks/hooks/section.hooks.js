import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSections, createSection, updateSection, deleteSection } from "../api/section.service";

export function useSections(projectId) {
    return useQuery({
        queryKey: ["sections", projectId],
        queryFn: async () => {
            const res = await getSections({ projectId });
            if (!res.success) return null;
            return res.data;
        },
        retry: false,
        staleTime: 10_000,
    });
}

export function useCreateSection(options) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSection,
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: ["sections", variables.projectId ?? ""],
            });

            options?.onSuccess?.(data, variables, context);
        },

        onError: (...args) => {
            options?.onError?.(...args);
        },
    });
}

export function useUpdateSection(options) {
    const queryClient = useQueryClient();

    return useMutation({
        // projectId is need by omSuccess for invalidating correct queryKey
        mutationFn: ({ projectId, ...payload }) => {
            return updateSection(payload);
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: ["sections", variables.projectId ?? ""],
            });

            options?.onSuccess?.(data, variables, context);
        },

        onError(...args) {
            options?.onError?.(...args);
        },
    });
}

export function useDeleteSection(options) {
    const queryClient = useQueryClient();

    return useMutation({
        // projectId is need by omSuccess for invalidating correct queryKey
        mutationFn: ({ projectId, ...payload }) => {
            return deleteSection(payload);
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: ["sections", variables.projectId ?? ""],
            });

            options?.onSuccess?.(data, variables, context);
        },

        onError(...args) {
            options?.onError?.(...args);
        },
    });
}
