import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    login,
    logout,
    register,
    getUser,
    checkUsernameAvailability,
    updateName,
    updateUsernameAndEmail,
    changePassword,
} from "../api/auth.service";

// ===== Get Current User =====
export function useSession() {
    return useQuery({
        queryKey: ["session"],
        queryFn: async () => {
            try {
                const res = await getUser();
                return res.data;
            } catch (err) {
                if (err.status === 401) return null;
                throw err;
            }
        },
        retry: false,
        staleTime: Infinity,
    });
}

// ===== Get if User is Logged in =====
export function useIsAuthenticated() {
    const { data } = useSession();
    return !!data;
}

// ===== Login =====
export function useLogin(options) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: (data, variables, context) => {
            queryClient.setQueryData(["session"], data.data.user);
            options?.onSuccess?.(data, variables, context);
        },
        onError: (...args) => {
            options?.onError?.(...args);
        },
    });
}

// ===== Logout =====
export function useLogout(options) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,

        onSuccess: (...args) => {
            queryClient.clear();
            options?.onSuccess?.(...args);
        },
        onError: (...args) => {
            options?.onError?.(...args);
        },
    });
}

// ===== Register =====
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

        onSuccess: (data, variables, context) => {
            queryClient.setQueryData(["session"], data.data.user);
            options?.onSuccess?.(data, variables, context);
        },
        onError: (...args) => {
            options?.onError?.(...args);
        },
    });
}

// ===== Check Username Availability =====
export function useUsernameAvailability(username) {
    return useQuery({
        queryKey: ["username-availability", username],
        queryFn: async () => {
            const res = await checkUsernameAvailability(username);
            if (res.success) return res.data;
            else return null;
        },
        enabled: !!username && username.length >= 3,
        staleTime: 30_000,
        retry: false,
    });
}

// ===== Update Name =====
export function useUpdateName(options = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateName,

        onSuccess: (...args) => {
            queryClient.clear();
            options?.onSuccess?.(...args);
        },

        onError: (...args) => {
            options?.onError?.(...args);
        },
    });
}

// ===== Update Username & Email =====
export function useUpdateUsernameAndEmail(options = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUsernameAndEmail,

        onSuccess: (...args) => {
            queryClient.setQueryData(["session"], null);
            queryClient.cancelQueries({ queryKey: ["session"] });

            options?.onSuccess?.(...args);
        },

        onError: (...args) => {
            options?.onError?.(...args);
        },
    });
}

// ===== Change Password =====
export function useChangePassword(options = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: changePassword,
        onSuccess: (...args) => {
            queryClient.clear();
            options?.onSuccess?.(...args);
        },

        onError: (...args) => {
            options?.onError?.(...args);
        },
    });
}
