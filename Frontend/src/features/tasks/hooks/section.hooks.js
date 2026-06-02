import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSections, createSection, updateSection, deleteSection } from "../api/section.service";

// ===== Get Sections =====
export function useSections(project) {
    return useQuery({
        queryKey: ["sections", project],
        queryFn: async () => {
            const res = await getSections({ project });
            if (!res.success) return null;
            return res.data;
        },
        retry: false,
        staleTime: 10_000,
    });
}

// ===== Create Section =====
export function useCreateSection(options) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSection,
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: ["sections", variables.project ?? ""],
            });

            options?.onSuccess?.(data, variables, context);
        },

        onError: (...args) => {
            options?.onError?.(...args);
        },
    });
}

// ===== Update Section =====
export function useUpdateSection(options) {
    const queryClient = useQueryClient();

    return useMutation({
        // project is need by omSuccess for invalidating correct queryKey
        mutationFn: ({ project, ...payload }) => {
            return updateSection(payload);
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: ["sections", variables.project ?? ""],
            });

            options?.onSuccess?.(data, variables, context);
        },

        onError(...args) {
            options?.onError?.(...args);
        },
    });
}

// ===== Delete Section =====
export function useDeleteSection(options) {
    const queryClient = useQueryClient();

    return useMutation({
        // project is need by omSuccess for invalidating correct queryKey
        mutationFn: ({ project, ...payload }) => {
            return deleteSection(payload);
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: ["sections", variables.project ?? ""],
            });

            options?.onSuccess?.(data, variables, context);
        },

        onError(...args) {
            options?.onError?.(...args);
        },
    });
}
