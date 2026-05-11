import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProjects } from "../api/project.service";

export function useProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const res = await getProjects();
            if (!res.success) return null;
            return res.data;
        },
        retry: false,
        staleTime: Infinity,
    });
}
