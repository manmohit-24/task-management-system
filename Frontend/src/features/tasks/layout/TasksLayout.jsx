import styles from "./TasksLayout.module.css";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInboxId, useProjectById } from "@/features/tasks/hooks/project.hooks";
import { useSidebarState, useViewMode } from "../TaskLayoutProvider/TaskLayoutProvider";

import { Toolbar } from "../components/toolbar";
import { Sidebar } from "../components/sidebar";
import { ProjectPage, ProjectNotFoundPage, LoadingPage, TodayPage } from "../pages";
import { TaskLayoutProvider } from "../TaskLayoutProvider/TaskLayoutProvider";

export default function TasksLayout() {
    // ===== Noramalizing Project =====
    const navigate = useNavigate();

    const { id } = useParams();
    const inboxId = useInboxId();

    if (id === inboxId) navigate("app/inbox");

    const project = id === "inbox" ? inboxId : id;

    return (
        <TaskLayoutProvider>
            <Layout project={project} />
        </TaskLayoutProvider>
    );
}

function Layout({ project }) {
    const { expanded: sidebarExpanded } = useSidebarState();
    const { view } = useViewMode();

    const { data: projectRes, isPending } = useProjectById(project);

    const [addingSection, setAddingSection] = useState(false);
    const projectNotFound = project !== "today" && !projectRes;

    return (
        <div
            className={`
                ${styles.container}
                ${!sidebarExpanded ? styles.sidebarCollapsed : ""}
                ${styles[view]}
            `}
        >
            {/* ===== Sidebar ===== */}
            <aside className={styles.sidebar}>
                <Sidebar />
            </aside>

            {isPending ? (
                <LoadingPage />
            ) : projectNotFound ? (
                <ProjectNotFoundPage />
            ) : (
                <div className={styles.page}>
                    {/* ===== Toolbar ===== */}
                    <div className={styles.toolbar}>
                        <Toolbar onAddSection={() => setAddingSection(true)} />
                    </div>

                    <div className={styles.gap} />

                    {/* ===== Page ===== */}
                    {project === "today" ? (
                        <TodayPage />
                    ) : (
                        <ProjectPage
                            project={project}
                            addingSection={addingSection}
                            setAddingSection={setAddingSection}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
