import createClient from "@/shared/libs/createClient";

const request = createClient("/users");

// ===== Login =====
export async function login({ email, username, password }) {
    return request("/login", {
        method: "POST",
        body: JSON.stringify({ email, username, password }),
    });
}

// ===== Register =====
export async function register({ email, name, username, password }) {
    return request("/register", {
        method: "POST",
        body: JSON.stringify({ email, name, username, password }),
    });
}

// ===== Logout =====
export async function logout() {
    return request("/logout", {
        method: "POST",
    });
}

// ===== Get Current User =====
export async function getUser() {
    return request("/me", {
        method: "GET",
    });
}

// ===== Check Username Availability =====
export async function checkUsernameAvailability(username) {
    return request(`/check-unique-username?username=${encodeURIComponent(username)}`);
}

// ===== Change Password =====
export async function changePassword({ oldPassword, newPassword }) {
    return request("/change-password", {
        method: "POST",
        body: JSON.stringify({ oldPassword, newPassword }),
    });
}

// ===== Update Name =====
export async function updateName({ name }) {
    return request("/update-name", {
        method: "PATCH",
        body: JSON.stringify({ name }),
    });
}

// ===== Update Username & Email =====
export async function updateUsernameAndEmail({ username, email, password }) {
    return request("/update-username-email", {
        method: "PATCH",
        body: JSON.stringify({ email, username, password }),
    });
}
