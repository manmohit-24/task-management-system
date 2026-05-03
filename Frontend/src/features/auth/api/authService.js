import config from "@/app/config";

async function request(path, options = {}) {
    const response = await fetch(`${config.apiUrl}/users${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    });

    const res = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(res?.message || "Something went wrong");
        error.status = response.status;
        error.json = res;
        throw error;
    }

    return res;
}

export async function login({ email, username, password }) {
    return request("/login", {
        method: "POST",
        body: JSON.stringify({ email, username, password }),
    });
}

export async function register({ email, name, username, password }) {
    return request("/register", {
        method: "POST",
        body: JSON.stringify({ email, name, username, password }),
    });
}

export async function logout() {
    return request("/logout", {
        method: "POST",
    });
}

export async function getUser() {
    return request("/me", {
        method: "GET",
    });
}

export async function checkUsernameAvailability(username) {
    return request(`/check-unique-username?username=${encodeURIComponent(username)}`);
}
