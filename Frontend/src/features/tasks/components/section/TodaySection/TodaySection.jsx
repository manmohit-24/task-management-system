import styles from "./TodaySection.module.css";
import { useState } from "react";

import { useViewMode } from "@/features/tasks/TaskLayoutProvider/TaskLayoutProvider";
import { useInboxId } from "@/features/tasks/hooks/project.hooks";

import { getPrettyTodayString } from "@/shared/libs/relativeDueDate";
import { TaskCard, TaskCreateForm } from "../../task";
import { ChevronDown, Dot } from "lucide-react";

export default function TodaySection({ type = "today", todos = [] }) {
    const { view } = useViewMode();

    const [collapsedTasks, setCollapsedTasks] = useState(false);

    const isToday = type === "today";
    const inboxId = useInboxId();
    const today = getPrettyTodayString();

    return (
        <section
            className={`
            ${styles.container}
            ${styles[view]}
            ${collapsedTasks ? styles.collapsed : ""}
            ${isToday ? styles.today : styles.overdue}
        `}
        >
            {/* ===== HEADER ===== */}
            <div className={styles.heading}>
                {/* ===== Header Left Icons ===== */}
                <button
                    className={styles.iconButton}
                    onClick={() => setCollapsedTasks((prev) => !prev)}
                >
                    <ChevronDown
                        size={18}
                        className={`${styles.chevron} ${collapsedTasks ? styles.chevronCollapsed : ""}`}
                    />
                </button>
                {/* ===== Heading ===== */}{" "}
                <div className={styles.headingContent}>
                    <div className={styles.title}>
                        <h2>
                            {isToday ? (
                                <>
                                    <span>{today}</span>
                                    <Dot size={20} />
                                    <span>Today</span>{" "}
                                </>
                            ) : (
                                "Overdue"
                            )}
                        </h2>
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
                    {isToday && (
                        <TaskCreateForm section={null} project={inboxId} defaultDate={Date.now()} />
                    )}
                </div>
            </div>
        </section>
    );
}
