import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProjects, createProject, updateProject, deleteProject } from "../api/project.service";

// ===== Get Projects =====
export function useProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const res = await getProjects();
            if (!res.success) return null;
            return res.data;
        },
        retry: false,
        staleTime: 10_000,
    });
}

// ===== Get Project-id of inbox =====
export function useInboxId() {
    const { data: projects } = useProjects();
    return projects?.find((project) => project.isInbox)?._id;
}

// ===== Get a single Project details using id =====
export function useProjectById(id) {
    const projectsQuery = useProjects();

    const project = projectsQuery.data?.find((project) => project._id === id);

    return {
        ...projectsQuery,
        data: project,
    };
}

// ===== Create Project =====
export function useCreateProject(options) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProject,
        onSuccess: (...args) => {
            queryClient.invalidateQueries("projects");
            options?.onSuccess?.(...args);
        },
        onError: (...args) => {
            options.onError(...args);
        },
    });
}

// ===== Update Project =====
export function useUpdateProject(options) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProject,
        onSuccess(...args) {
            queryClient.invalidateQueries("projects");
            options?.onSuccess?.(...args);
        },
        onError(...args) {
            options?.onError?.(...args);
        },
    });
}

// ===== Delete Project =====
export function useDeleteProject(options) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProject,
        onSuccess(...args) {
            queryClient.invalidateQueries("projects");
            options?.onSuccess?.(...args);
        },
        onError(...args) {
            options?.onError?.(...args);
        },
    });
}
