import styles from "./Sidebar.module.css";
import config from "@/app/config";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjects } from "../../hooks/project.hooks";

import { SidebarLabel, AddProjectDropDown } from "..";
import { LayoutGrid, Inbox, ChevronRight } from "lucide-react";
import { Logo, Sidebar as SidebarIcon, Today } from "@/features/shared/components/Icons/";

export default function Sidebar({ isSidebarExpanded = true, onToggleSidebarExpansion = () => {} }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data } = useProjects();
    const allProjects = data ?? [];

    const [isWorkspaceExpanded, setIsWorkspaceExpanded] = useState(true);

    const handleNavigation = (projectId) => {
        navigate(`/app/${projectId}`);
    };

    const defaults = [
        {
            id: "today",
            name: "Today",
            number: "0",
            color: "var(--text-disabled)",
            icon: <Today size={20} />,
            allowEdits: false,
        },
        {
            id: "inbox",
            name: "Inbox",
            number: "0",
            color: "var(--text-disabled)",
            icon: <Inbox size={20} />,
            allowEdits: false,
        },
    ];

    let projects = allProjects
        .filter((p) => !p.isInbox)
        .map((p) => ({
            id: p?._id ?? "",
            name: p?.name ?? "",
            number: "0",
            color: "var(--text-disabled)",
        }));

    return (
        <nav
            className={`${styles.container} ${styles[isSidebarExpanded ? "expanded" : "collapsed"]}`}
        >
            {/* --------------------- SidebarHeader --------------------- */}

            <header className={styles.header}>
                <div className={styles.brand}>
                    <Logo size={28} />
                    <p>{config.appName}</p>
                </div>

                <button
                    className={styles.sidebarButton}
                    onClick={() => onToggleSidebarExpansion()}
                    aria-label="Toggle sidebar"
                >
                    <SidebarIcon size={20} />
                </button>
            </header>

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
