import createClient from "@/shared/libs/createClient.js";

const request = createClient("/section");

export function getSections({ projectId }) {
    return request(`/?project=${projectId}`, {
        method: "GET",
    });
}

export function createSection({ name, projectId }) {
    return request("/", {
        method: "POST",
        body: JSON.stringify({ name, project: projectId }),
    });
}

export function updateSection({ id, name }) {
    return request(`/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name }),
    });
}

export function deleteSection({ id }) {
    return request(`/${id}`, {
        method: "DELETE",
    });
}
