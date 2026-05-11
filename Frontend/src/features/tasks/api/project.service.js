import createClient from "@/features/shared/libs/createClient.js";

const request = createClient("/project");

export function getProjects() {
    return request("/", {
        method: "GET",
    });
}

export function createProject({ name, color }) {
    return request("/", {
        method: "POST",
        body: JSON.stringify({ name, color }),
    });
}
