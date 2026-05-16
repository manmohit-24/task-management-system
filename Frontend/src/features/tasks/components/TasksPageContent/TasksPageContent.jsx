import styles from "./TasksPageContent.module.css";
import { useParams } from "react-router-dom";
import { TasksSection } from "../";

export default function TasksPageContent({ view }) {
    const { id } = useParams();

    const sections = [];

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
                    <TasksSection key={sectionId} sectionId={sectionId} view={view} />
                ))}
            </div>
        </section>
    );
}
