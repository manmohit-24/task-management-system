import createClient from "@/shared/libs/createClient.js";
import createQueryString from "@/shared/libs/createQueryString";

const request = createClient("/todo");

// ===== Get Tasks =====
export function getTasks({ project, section, parentId, dueDate }) {
    const q = createQueryString({ project, section, parentId, dueDate });
    return request(`/${q}`, {
        method: "GET",
    });
}

// ===== Get Task Detail By Id =====
export function getTaskById({ id }) {
    return request(`/${id}/toggle`, {
        method: "GET",
    });
}

// ===== Create Task =====
export function createTask({
    content,
    description,
    priority,
    dueDate,
    project,
    section,
    parentId,
}) {
    return request("/", {
        method: "POST",
        body: JSON.stringify({
            content,
            description,
            priority,
            dueDate,
            project,
            section,
            parentId,
        }),
    });
}

// ===== Update Task =====
export function updateTask(data) {
    /* data can include these fields :
      {
        id,
        content,
        description,
        priority,
        dueDate,
        project,
        section,
        parentId,
      }
    */

    const { id, ...rest } = data;
    return request(`/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
            ...rest,
        }),
    });
}

// ===== Toggle Task Completition =====
export function toggleTask({ id }) {
    return request(`/${id}/toggle`, {
        method: "PATCH",
    });
}
