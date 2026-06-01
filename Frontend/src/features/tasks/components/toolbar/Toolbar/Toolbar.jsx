import styles from "./Toolbar.module.css";
import { useParams } from "react-router-dom";
import { useProjects } from "@/features/tasks/hooks/project.hooks";

import { SquareKanban } from "lucide-react";
import { AddSection } from "@/shared/icons";
import { ProfileMenu } from "..";
import { toast } from "sonner";
import { useEffect } from "react";

const DEFAULT_PROJECTS = {
    today: "Today",
    upcoming: "Upcoming",
    inbox: "Inbox",
};

export default function Toolbar({ view, onToggleView, onAddSection }) {
    const { id } = useParams();

    const { data, error } = useProjects();
    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    const projectName = data?.find((project) => project._id === id)?.name;
    const heading = DEFAULT_PROJECTS[id] ?? projectName ?? "Not Found";

    return (
        <header className={styles.toolbar}>
            {/* ===== Project Name ===== */}
            <div className={styles.left}>
                <div className={styles.projectInfo}>
                    {!DEFAULT_PROJECTS[id] && <span className={styles.projectLabel}>Project</span>}
                    <h1 className={styles.projectName}>{heading}</h1>
                </div>
            </div>

            {/* ===== Action Buttons ===== */}
            <div className={styles.right}>
                {/* ===== Chnage View ===== */}
                <button
                    type="button"
                    className={styles.actionButton}
                    onClick={onToggleView}
                    title="Change view"
                >
                    <SquareKanban
                        size={18}
                        className={`${styles.viewIcon} ${view === "list" ? styles.rotate : ""}`}
                    />
                </button>

                {/* ===== Add Section -> not allowed for "today" ===== */}
                {id !== "today" && (
                    <button
                        type="button"
                        className={styles.actionButton}
                        onClick={onAddSection}
                        title="Add new section"
                    >
                        <AddSection size={18} />
                    </button>
                )}

                {/* ===== Profile Menu ===== */}
                <div className={styles.profileMenu}>
                    <ProfileMenu />
                </div>
            </div>
        </header>
    );
}
