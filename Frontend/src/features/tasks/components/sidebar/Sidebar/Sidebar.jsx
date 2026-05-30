import styles from "./Sidebar.module.css";
import config from "@/app/config";

import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProjects } from "@/features/tasks/hooks/project.hooks";

import { LayoutGrid, Inbox, ChevronRight } from "lucide-react";
import { Logo, Sidebar as SidebarIcon, Today } from "@/shared/icons";
import { SidebarItem, SidebarCreateProjectMenu } from "..";

export default function Sidebar({ expanded = true, onExpandedChange = () => {} }) {
    const { id } = useParams();
    const { data } = useProjects();
    const allProjects = data ?? [];

    // ===== Default Projects =====
    const defaultProjects = [
        {
            id: "today",
            name: "Today",
            number: "0",
            color: "var(--text-secondary)",
            icon: Today,
            allowEdits: false,
        },
        {
            id: "inbox",
            name: "Inbox",
            number: "0",
            color: "var(--text-secondary)",
            icon: Inbox,
            allowEdits: false,
        },
    ];

    // ===== Workspace =====
    const [isWorkspaceExpanded, setIsWorkspaceExpanded] = useState(true);

    const workspaceProjects = allProjects
        .filter((p) => !p.isInbox)
        .map((p) => ({
            id: p?._id ?? "",
            name: p?.name ?? "",
            number: "0",
            color: "var(--text-secondary)",
        }));

    // ===== Block Collapse  =====
    // Block Collapse if there is an action in progress
    const [blockCollapse, setBlockCollapse] = useState(false);
    const handleActionInProgressChange = (val) => {
        setBlockCollapse(val);
    };

    return (
        <nav
            className={`${styles.container} ${styles[expanded ? "expanded" : "collapsed"]} ${blockCollapse ? styles.blockCollapse : ""}`}
        >
            {/* ===== Header ===== */}

            <header className={styles.header}>
                <div className={styles.brand}>
                    <Logo size={28} />
                    <p>{config.appName}</p>
                </div>

                <button
                    className={styles.sidebarButton}
                    onClick={() => onExpandedChange(!expanded)}
                    aria-label="Toggle sidebar"
                >
                    <SidebarIcon size={20} />
                </button>
            </header>

            {/* ===== Default Projects ===== */}
            <div className={styles.list}>
                {defaultProjects.map((project) => (
                    <SidebarItem
                        key={project.id}
                        {...project}
                        selected={id == project.id}
                        onActionInProgressChange={handleActionInProgressChange}
                    />
                ))}
            </div>

            {/* ===== Workspaces ===== */}
            <div className={styles.heading}>
                <div>Workspaces</div>

                <div className={styles.headingButtons}>
                    <SidebarCreateProjectMenu
                        className={styles.headingButton}
                        onActionInProgressChange={handleActionInProgressChange}
                    />

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

            {/* ===== Workspace Projects ===== */}
            <div
                className={`${styles.list} ${isWorkspaceExpanded ? "" : styles.collapsedWorkspace}`}
            >
                {workspaceProjects.map((project) => (
                    <SidebarItem
                        key={project.id}
                        {...project}
                        icon={LayoutGrid}
                        selected={id == project.id}
                        onActionInProgressChange={handleActionInProgressChange}
                    />
                ))}
            </div>
        </nav>
    );
}
