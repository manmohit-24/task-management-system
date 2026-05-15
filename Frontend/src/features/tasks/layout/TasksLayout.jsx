import styles from "./TasksLayout.module.css";
import { Sidebar, Toolbar } from "../components";
import { useState } from "react";

export default function TasksLayout() {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
        const storedValue = localStorage.getItem("isSidebarExpanded");
        if (storedValue === null) return true;
        return storedValue === "true";
    });

    const onToggleSidebarExpansion = () => {
        setIsSidebarExpanded((p) => {
            localStorage.setItem("isSidebarExpanded", String(!p));
            return !p;
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

            <main className={styles.content}>
                <div className={styles.contentInner}>
                    <Toolbar />

                    <section className={styles.pageContent}></section>
                </div>
            </main>
        </div>
    );
}
