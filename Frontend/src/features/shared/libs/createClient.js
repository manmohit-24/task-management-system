import config from "@/app/config";

// ----- Refresh Access Token  ------
let refreshPromise = null;

async function refreshAccessToken() {
    const { response } = await executeRequest(`${config.apiUrl}/users/refreshToken`, {
        method: "POST",
    });

    return response.ok;
}
// ----------------------------------

export async function executeRequest(url, options = {}) {
    const response = await fetch(url, {
        credentials: "include",

        ...options,

        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const res = await response.json().catch(() => ({}));

    return { response, res };
}

export default function createClient(base) {
    return async (path, options = {}) => {
        const url = `${config.apiUrl}${base}${path}`;

        let { response, res } = await executeRequest(url, options);

        if (response.status === 401 && path !== "/refreshToken") {
            if (!refreshPromise)
                refreshPromise = refreshAccessToken().finally(() => {
                    refreshPromise = null;
                });

            const refreshSuccess = await refreshPromise;

            if (refreshSuccess) ({ response, res } = await executeRequest(url, options));
        }

        if (!response.ok) {
            const error = new Error(res?.message || "Something went wrong");

            error.status = response.status;
            error.json = res;

            throw error;
        }

        return res;
    };
}
