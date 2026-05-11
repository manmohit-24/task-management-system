import createClient from "@/features/shared/libs/createClient.js";

const request = createClient("/project");

export function getProjects() {
    return request("/", { method: "GET" });
}
