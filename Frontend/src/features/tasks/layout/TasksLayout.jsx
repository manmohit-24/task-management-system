import styles from "./TasksLayout.module.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useIsAuthenticated } from "@/features/auth/hooks/auth.hook";
import { useInboxId, useProjectById } from "@/features/tasks/hooks/project.hooks";
import { useSidebarState, useViewMode } from "../TaskLayoutProvider/TaskLayoutProvider";

import { Navigate } from "react-router-dom";
import { Toolbar } from "../components/toolbar";
import { Sidebar } from "../components/sidebar";
import { ProjectPage, ProjectNotFoundPage, LoadingPage, TodayPage } from "../pages";
import { TaskLayoutProvider } from "../TaskLayoutProvider/TaskLayoutProvider";
import { toast } from "sonner";

export default function TasksLayout() {
    // ===== Routings =====
    const { id } = useParams();
    const isAuthenticated = useIsAuthenticated();
    const inboxId = useInboxId();

    useEffect(() => {
        // using it without effect casue multiple toast on auth fail
        if (!isAuthenticated) toast.error("Please login to access the app");
    }, [isAuthenticated]);

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (id === inboxId) return <Navigate to="/app/inbox" replace />;

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
