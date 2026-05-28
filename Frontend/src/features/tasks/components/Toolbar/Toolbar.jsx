import styles from "./Toolbar.module.css";
import { useParams } from "react-router-dom";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import { SquareKanban } from "lucide-react";
import { AddSection } from "@/shared/icons";
import { useProjects } from "../../hooks/project.hooks";

const DEFAULT_PROJECTS = {
    today: "Today",
    upcoming: "Upcoming",
    inbox: "Inbox",
};

export default function Toolbar({ view, onToggleView, onAddSection }) {
    const { id } = useParams();

    const { data: projects } = useProjects();

    const projectName = projects?.find((project) => project._id === id)?.name;
    const heading = DEFAULT_PROJECTS[id] ?? projectName ?? "Not Found";

    const canAddSection = id !== "today";

    const isListView = view === "list";

    return (
        <header className={styles.toolbar}>
            <div className={styles.left}>
                <div className={styles.projectInfo}>
                    {!DEFAULT_PROJECTS[id] && <span className={styles.projectLabel}>Project</span>}
                    <h1 className={styles.projectName}>{heading}</h1>
                </div>
            </div>

            <div className={styles.right}>
                <button
                    type="button"
                    className={styles.actionButton}
                    onClick={onToggleView}
                    title="Change view"
                >
                    <SquareKanban
                        size={18}
                        className={`${styles.viewIcon} ${isListView ? styles.rotate : ""}`}
                    />
                </button>
                {canAddSection && (
                    <button
                        type="button"
                        className={styles.actionButton}
                        onClick={onAddSection}
                        title="Add new section"
                    >
                        <AddSection size={18} />
                    </button>
                )}

                <div className={styles.profileMenu}>
                    <ProfileMenu />
                </div>
            </div>
        </header>
    );
}
