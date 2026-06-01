import styles from "./TasksLayout.module.css";
import { Toolbar } from "../components/toolbar";
import { useState } from "react";
import { useSections } from "../hooks/section.hooks";
import { useParams } from "react-router-dom";
import { useInboxId } from "../hooks/project.hooks";
import { Section, SectionCreateForm } from "../components/section";
import { Sidebar } from "../components/sidebar";

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
    const { id } = useParams();
    const inboxId = useInboxId();

    const projectId = id === "inbox" ? inboxId : id;

    //  Sidebar expansion state
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(getSideBarStoredState());

    const onSidebarExpandedChange = (val) => {
        localStorage.setItem("isSidebarExpanded", String(val));
        setIsSidebarExpanded(val);
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

    // Section
    const { data } = useSections(projectId);
    const sections = data ?? [];

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
                <Sidebar expanded={isSidebarExpanded} onExpandedChange={onSidebarExpandedChange} />
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
                            {sections.map(({ _id, name, project }) => (
                                <Section
                                    key={_id}
                                    id={_id}
                                    name={name}
                                    project={project}
                                    view={view}
                                />
                            ))}
                            <SectionCreateForm
                                open={addingSection}
                                onOpenChange={setAddingSection}
                                view={view}
                                project={projectId}
                            />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
