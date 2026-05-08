import styles from "./Sidebar.module.css";
import { useState } from "react";
import { SidebarHeader, SidebarLabel, AddProjectDropDown } from "..";
import { useNavigate, useParams } from "react-router-dom";
import { LayoutGrid, Inbox, ChevronRight } from "lucide-react";
import { Today } from "@/features/shared/components/Icons";

export default function Sidebar() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isWorkspaceExpanded, setIsWorkspaceExpanded] = useState(true);

    const handleNavigation = (projectId) => {
        navigate(`/app/${projectId}`);
    };

    const defaults = [
        {
            id: "today",
            title: "Today",
            number: "0",
            color: "var(--text-disabled)",
            icon: <Today size={20} />,
            allowEdits: false,
        },
        {
            id: "inbox",
            title: "Inbox",
            number: "0",
            color: "var(--text-disabled)",
            icon: <Inbox size={20} />,
            allowEdits: false,
        },
    ];

    const projects = [
        {
            id: "new123",
            title: "New Project",
            number: "0",
            color: "var(--text-disabled)",
        },
    ];

    return (
        <nav
            className={`${styles.container} ${styles[isSidebarExpanded ? "expanded" : "collapsed"]}`}
        >
            {/* --------------------- SidebarHeader --------------------- */}
            <SidebarHeader
                IsExpanded={isSidebarExpanded}
                toggleExpansion={() => setIsSidebarExpanded(!isSidebarExpanded)}
            />

            {/* --------------------- SidebarDefaultLabels --------------------- */}
            <div className={styles.list}>
                {defaults.map((project) => (
                    <SidebarLabel
                        key={project.id}
                        {...project}
                        selected={id == project.id}
                        onClick={handleNavigation}
                    />
                ))}
            </div>

            {/* --------------------- SidebarCustomListsHeading --------------------- */}
            <div className={styles.heading}>
                <div>Workspaces</div>

                <div className={styles.headingButtons}>
                    <AddProjectDropDown className={styles.headingButton} />

                    <button
                        className={styles.headingButton}
                        onClick={() => setIsWorkspaceExpanded(!isWorkspaceExpanded)}
                    >
                        <ChevronRight
                            size={16}
                            className={`${styles.chervon}  ${isWorkspaceExpanded ? styles.open : ""}`}
                        />
                    </button>
                </div>
            </div>

            {/* --------------------- SidebarCustomLists --------------------- */}
            <div
                className={`${styles.list} ${isWorkspaceExpanded ? "" : styles.collapsedWorkspace}`}
            >
                {projects.map((project) => (
                    <SidebarLabel
                        key={project.id}
                        {...project}
                        icon={<LayoutGrid size={20} />}
                        selected={id == project.id}
                        onClick={handleNavigation}
                    />
                ))}
            </div>
        </nav>
    );
}
