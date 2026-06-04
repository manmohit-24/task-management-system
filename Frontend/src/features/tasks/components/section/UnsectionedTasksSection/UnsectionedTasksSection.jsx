import styles from "./UnsectionedTasksSection.module.css";
import { useState } from "react";

import { useTasks } from "@/features/tasks/hooks/tasks.hooks.js";
import { useViewMode } from "@/features/tasks/TaskLayoutProvider/TaskLayoutProvider";

import { TaskCard, TaskCreateForm } from "../../task";
import { toast } from "sonner";

import { ChevronDown } from "lucide-react";
import { useEffect } from "react";

export default function UnsectionedTasksSection({ project }) {
    const { view } = useViewMode();

    // ===== Tasks Content =====
    const [collapsedTasks, setCollapsedTasks] = useState(false);
    const { data, error } = useTasks({ project, section: null, parentId: null });

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    const todos = data ?? [];

    return (
        <section
            className={`
            ${styles.container}
            ${styles[view]}
            ${collapsedTasks ? styles.collapsed : ""}
        `}
        >
            {/* ===== HEADER ===== */}
            <div className={styles.heading}>
                {/* ===== Header Left Icons ===== */}

                <div className={styles.headingLeft}>
                    <button
                        className={styles.iconButton}
                        onClick={() => setCollapsedTasks((prev) => !prev)}
                    >
                        <ChevronDown
                            size={18}
                            className={`${styles.chevron} ${collapsedTasks ? styles.chevronCollapsed : ""}`}
                        />
                    </button>
                </div>

                {/* ===== Heading ===== */}
                <div className={styles.headingContent}>
                    <div className={styles.title}>
                        <h2>(No Section)</h2>
                        <p>{todos.length}</p>
                    </div>
                </div>
                <div className={styles.separator} />
            </div>

            {/* ===== CONTENT ===== */}
            <div className={styles.content}>
                <div className={styles.todos}>
                    {todos.map((task) => (
                        <TaskCard key={task._id} {...task} id={task._id} />
                    ))}
                    <TaskCreateForm section={null} project={project} />
                </div>
            </div>
        </section>
    );
}
