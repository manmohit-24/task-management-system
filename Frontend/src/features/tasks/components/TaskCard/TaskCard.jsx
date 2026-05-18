import { useMemo, useState } from "react";
import styles from "./TaskCard.module.css";
import { TodoCheckBox } from "@/components";
import { LayoutGrid } from "lucide-react";
import { ListTree } from "@/features/shared/components/Icons";
import { DatePickerDropdown } from "../";

export default function TaskCard({
    id,
    content = "Design dashboard layout",
    description = "Refactor layout spacing and improve responsive structure for task cards.",
    priority = 2,
    completed = false,
    dueDate = new Date(),
    subTasks = [],
    section = {
        id: "section-1",
        name: "UI Polish",
    },
    project = {
        id: "project-1",
        name: "Frontend",
        color: "#8b5cf6",
    },
    isSubTask = false,
    view = "list",
    parentTaskCompleted = false,
}) {
    const [expandedSubTasks, setExpandedSubTasks] = useState(false);
    const isCompleted = parentTaskCompleted || completed;

    const subTaskCount = subTasks.length;
    const remainingSubTasks = useMemo(() => {
        return subTasks.filter((task) => !task.completed).length;
    }, [subTasks]);

    const rootClassName = `
        ${styles.card}
        ${styles[view]}
        ${isCompleted ? styles.completed : ""}
        ${expandedSubTasks ? styles.expanded : ""}
    `;

    async function handleToggleCompleted(e) {
        e.stopPropagation();
        console.log("toggle completed");
    }
    const handleDateChange = async (val) => {
        console.log({
            dueDate: val?.toString(),
        });
    };

    function openEditor() {
        console.log("open editor");
    }

    return (
        <article className={rootClassName} data-priority={priority}>
            {/* Body */}
            <div className={styles.body}>
                <div className={styles.content} onClick={openEditor}>
                    {view === "board" ? (
                        <>
                            <div className={styles.boardHeader}>
                                <TodoCheckBox checked={isCompleted} />
                                <h4 className={styles.boardTitle}>{content}</h4>
                            </div>

                            <div className={styles.boardFooter}>
                                <DatePickerDropdown
                                    value={dueDate}
                                    onChange={handleDateChange}
                                    disabled={isCompleted}
                                    triggerClassName={styles.metaItem}
                                />

                                {subTaskCount > 0 && (
                                    <div className={styles.metaItem}>
                                        <ListTree size={16} />

                                        <span>
                                            {remainingSubTasks}/{subTaskCount}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.header}>
                                <TodoCheckBox checked={isCompleted} />

                                <div className={styles.textContent}>
                                    <h4 className={styles.title}>{content}</h4>

                                    {description && (
                                        <p className={styles.description}>{description}</p>
                                    )}
                                </div>
                            </div>

                            <div className={styles.meta}>
                                <DatePickerDropdown
                                    value={dueDate}
                                    onChange={handleDateChange}
                                    disabled={isCompleted}
                                />

                                {subTaskCount > 0 && (
                                    <button
                                        type="button"
                                        className={`${styles.metaItem} ${
                                            expandedSubTasks ? styles.activeMeta : ""
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setExpandedSubTasks((prev) => !prev);
                                        }}
                                    >
                                        <ListTree size={16} />
                                        <span>
                                            {remainingSubTasks}/{subTaskCount}
                                        </span>
                                    </button>
                                )}

                                {!isSubTask && project && (
                                    <button
                                        type="button"
                                        className={`${styles.project} ${styles.metaItem}`}
                                        style={{
                                            "--project-color": project.color,
                                        }}
                                    >
                                        <LayoutGrid size={18} />
                                        <span>
                                            {project.name}
                                            {section?.name && `/${section.name}`}
                                        </span>
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Subtasks */}
                {subTaskCount > 0 && expandedSubTasks && view === "list" && (
                    <div className={styles.subTasks}>
                        {subTasks.map((subTask) => (
                            <TaskCard
                                key={subTask.id}
                                parentTaskCompleted={isCompleted}
                                view={view}
                                {...subTask}
                            />
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
}
