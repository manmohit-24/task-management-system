import styles from "./TasksPageContent.module.css";

import { useParams } from "react-router-dom";

import { TodoSection, TodoAddSection, TodoEditTask } from "@/components";

export default function TasksPageContent({ view }) {
    const { id } = useParams();

    const editingTaskId = null;

    // Temporary mock data.

    const sections = ["Today Tasks", "Work", "Personal", "Completed-Tasks"];

    if (id === "upcoming") {
        return null;
    }

    const isBoardView = view === "board";

    return (
        <section
            className={`${styles.pageContent} ${isBoardView ? styles.boardView : styles.listView}`}
        >
            <div className={styles.sectionsContainer}>
                {sections.map((sectionId) => (
                    <TodoSection key={sectionId} sectionId={sectionId} />
                ))}

                <TodoAddSection />

                {editingTaskId && <TodoEditTask id={editingTaskId} />}
            </div>
        </section>
    );
}
