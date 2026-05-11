import config from "@/app/config";

export default function createClient(base) {
    return async (path, options = {}) => {
        const response = await fetch(`${config.apiUrl}${base}${path}`, {
            credentials: "include",
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        const res = await response.json().catch(() => ({}));

        if (!response.ok) {
            const error = new Error(res?.message || "Something went wrong");

            error.status = response.status;
            error.json = res;

            throw error;
        }

        return res;
    };
}
