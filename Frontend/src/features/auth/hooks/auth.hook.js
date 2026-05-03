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

export function useLogin(options) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: login,

        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: ["session"] });
            options?.onSuccess?.(...args);
        },
    });
}

export function useLogout(options) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,

        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: ["session"] });
            options?.onSuccess?.(...args);
        },
    });
}
export function useRegister(options) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const registerRes = await register(data);

            if (!registerRes.success) throw new Error(registerRes.message || "Registration failed");

            const loginRes = await login({
                email: data.email,
                password: data.password,
            });

            if (!loginRes.success) throw new Error(loginRes.message || "Login failed");

            return loginRes;
        },

        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: ["session"] });
            options?.onSuccess?.(...args);
        },
    });
}
