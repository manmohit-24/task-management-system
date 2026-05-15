import styles from "./TasksLayout.module.css";
import { Sidebar, Toolbar, TasksPageContent } from "../components";
import { useState } from "react";

const getSideBarStoredState = () => {
    const storedValue = localStorage.getItem("isSidebarExpanded");
    if (storedValue === null) return true;
    return storedValue === "true";
};

const getStoredViewState = () => {
    const storedValue = localStorage.getItem("view");
    if (storedValue === null) return "list";
    return storedValue;
};

export default function TasksLayout() {
    //  Sidebar expansion state
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(getSideBarStoredState());

    const onToggleSidebarExpansion = () => {
        setIsSidebarExpanded((p) => {
            localStorage.setItem("isSidebarExpanded", String(!p));
            return !p;
        });
    };

    //  Page View Layout state
    const [view, setView] = useState(getStoredViewState());

    const onToggleView = () => {
        setView((p) => {
            const next = p === "list" ? "board" : "list";
            localStorage.setItem("view", next);
            return next;
        });
    };

    return (
        <div
            className={`${styles.page} ${
                isSidebarExpanded ? styles.sidebarExpanded : styles.sidebarCollapsed
            }`}
        >
            <aside className={styles.sidebar}>
                <Sidebar
                    isSidebarExpanded={isSidebarExpanded}
                    onToggleSidebarExpansion={onToggleSidebarExpansion}
                />
            </aside>

            <main className={`${styles.content} ${view === "board" ? styles.board : styles.list}`}>
                <div className={styles.contentInner}>
                    <Toolbar view={view} onToogleView={onToggleView} />

                    <TasksPageContent view={view} />
                </div>
            </main>
        </div>
    );
}
