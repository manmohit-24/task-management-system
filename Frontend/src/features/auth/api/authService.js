import createClient from "@/shared/libs/createClient";

const request = createClient("/users");

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
