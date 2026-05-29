import createClient from "@/shared/libs/createClient.js";

const request = createClient("/section");

// ===== Get Sections =====
export function getSections({ project }) {
    return request(`/?project=${project}`, {
        method: "GET",
    });
}

// ===== Create Section =====
export function createSection({ name, project }) {
    return request("/", {
        method: "POST",
        body: JSON.stringify({ name, project }),
    });
}

// ===== Update Section =====
export function updateSection({ id, name }) {
    return request(`/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name }),
    });
}

// ===== Delete Section =====
export function deleteSection({ id }) {
    return request(`/${id}`, {
        method: "DELETE",
    });
}
