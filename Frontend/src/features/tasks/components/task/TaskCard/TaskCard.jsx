import styles from "./TaskCard.module.css";
import { useState } from "react";
import { useToggleTask, useTasks, useUpdateTask } from "@/features/tasks/hooks/tasks.hooks";
import { useViewMode } from "@/features/tasks/TaskLayoutProvider/TaskLayoutProvider";

import { DatePickerMenu, TaskCheckbox } from "../";
import { ListTree } from "@/shared/icons";
import { toast } from "sonner";
export default function TaskCard({
    id,
    content,
    description,
    priority,
    status,
    dueDate,
    section,
    project,
    parentId,
}) {
    // ===== Derieved States =====
    const { view } = useViewMode();
    const isListView = view === "list";

    const isCompleted = status === "completed";

    // ===== Subtasks =====
    const [expandedSubTasks, setExpandedSubTasks] = useState(false);

    const { data } = useTasks({ project, section, parentId: id });
    const subtasks = data ?? [];
    const subtasksCount = subtasks.length;
    const remainingSubtasks = subtasks.filter((task) => !task.completed).length;

    // ===== Toggle Complete =====
    const { mutate: toogleTask } = useToggleTask({
        onError: (error) => toast.error(error),
    });
    const handleToggle = () => {
        toogleTask({ id, project, section, parentId });
    };

    // ===== Update Date =====
    const { mutate: updateTask } = useUpdateTask({
        onError: (error) => toast.error(error),
    });
    const handleDateChange = (val) => {
        updateTask({ id, project, parentId, section, dueDate: val });
    };

    // ===== Open Editor =====
    const openEditor = () => {
        console.log("open editor");
    };

    return (
        <article
            className={`
            ${styles.container} ${styles[view]} ${styles[`p${priority}`]}
            ${isCompleted ? styles.completed : ""}
            ${expandedSubTasks ? styles.expanded : ""}
        `}
            data-priority={priority}
        >
            {/* ===== Body ===== */}
            <div className={styles.body}>
                {/* ===== Task Card ===== */}
                <div className={styles.card} onClick={openEditor}>
                    {/* ===== Header -> Checkbox + Title + Description ===== */}
                    <div className={styles.header}>
                        <TaskCheckbox
                            checked={isCompleted}
                            onToggle={handleToggle}
                            priority={priority}
                        />
                        <div className={styles.textContent}>
                            <h4 className={styles.content}>{content}</h4>
                            {description && <p className={styles.description}>{description}</p>}
                        </div>
                    </div>

                    {/* ===== Meta ===== */}
                    <div className={styles.meta}>
                        <DatePickerMenu
                            value={dueDate}
                            onChange={handleDateChange}
                            disabled={isCompleted}
                            triggerClassName={`${styles.project} ${styles.metaItem}`}
                        />

                        {/* ===== Subtasks Count ===== */}
                        {subtasksCount > 0 && (
                            <button
                                type="button"
                                className={`${styles.metaItem} ${
                                    expandedSubTasks ? styles.activeMeta : ""
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isListView) setExpandedSubTasks((prev) => !prev);
                                }}
                            >
                                <ListTree size={16} />
                                <span>
                                    {remainingSubtasks}/{subtasksCount}
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                {/* ===== Subtasks ===== */}
                {subtasksCount > 0 && expandedSubTasks && isListView && (
                    <div className={styles.subtasks}>
                        {subtasks.map((subTask) => (
                            <TaskCard {...subTask} key={subTask._id} id={subTask._id} />
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
}
