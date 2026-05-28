import createClient from "@/shared/libs/createClient.js";
import createQueryString from "@/shared/libs/createQueryString";

const request = createClient("/todo");

/*
router.route("/:id")
                    .patch(updateTodo)
                    .delete(deleteTodo);

router.route("/:id/restore").patch(restoreTodo);
*/

export function getTasks({ projectId: project, sectionId: section, parentTaskId: parentId }) {
    const q = createQueryString({ project, section, parentId });
    return request(`/${q}`, {
        method: "GET",
    });
}

export function getTaskById({ id }) {
    return request(`/${id}/toggle`, {
        method: "GET",
    });
}

export function createTask({
    task: content,
    description,
    projectId: project,
    sectionId: section,
    parentTaskId: parentId,
    priority,
    dueDate,
}) {
    return request("/", {
        method: "POST",
        body: JSON.stringify({
            content,
            description,
            project,
            section,
            parentId,
            priority,
            dueDate,
        }),
    });
}

export function toggleTask({ id }) {
    return request(`/${id}/toggle`, {
        method: "PATCH",
    });
}
