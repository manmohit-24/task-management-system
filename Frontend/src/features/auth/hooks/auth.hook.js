import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, logout, register, checkActiveSession } from "../api/authService";

export function useSession() {
    return useQuery({
        queryKey: ["session"],
        queryFn: checkActiveSession,
        retry: false,
        staleTime: Infinity,
    });
}

export function useIsAuthenticated() {
    const { data } = useSession();
    return !!data;
}

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["session"] }),
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["session"] }),
    });
}

export function useRegister() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: register,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["session"] }),
    });
}
