import styles from "./TasksLayout.module.css";
import { Sidebar, Toolbar, TasksSection, AddSection } from "../components";
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
            const next = !p;
            localStorage.setItem("isSidebarExpanded", String(next));
            return next;
        });
    };

    //  Page View Layout state
    const [view, setView] = useState(getStoredViewState());

    const onToggleView = () => {
        console.log("FAAAH");
        setView((p) => {
            const next = p === "list" ? "board" : "list";
            localStorage.setItem("view", next);
            return next;
        });
    };

    // Placeholder content
    const sections = [1, 2, 3];
    const [addingSection, setAddingSection] = useState(false);

    return (
        <div
            className={`
                ${styles.page}
                ${isSidebarExpanded ? styles.sidebarExpanded : styles.sidebarCollapsed}
                ${view === "board" ? styles.boardView : styles.listView}
            `}
        >
            <aside className={styles.sidebar}>
                <Sidebar
                    isSidebarExpanded={isSidebarExpanded}
                    onToggleSidebarExpansion={onToggleSidebarExpansion}
                />
            </aside>

            <div className={styles.content}>
                <div className={styles.contentInner}>
                    <Toolbar
                        view={view}
                        onToggleView={onToggleView}
                        onAddSection={() => setAddingSection((p) => !p)}
                    />

                    <main className={styles.pageContent}>
                        <div className={styles.sectionsContainer}>
                            {sections.map((sectionId) => (
                                <TasksSection key={sectionId} sectionId={sectionId} view={view} />
                            ))}
                            <AddSection
                                open={addingSection}
                                onOpenChange={setAddingSection}
                                view={view}
                            />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
