import styles from "./SidebarHeader.module.css";
import config from "@/app/config";
import { Logo, Sidebar } from "@/features/shared/components/Icons/";

export default function SidebarHeader({ IsExpanded, toggleExpansion }) {
    return (
        <header className={styles.container}>
            <div className={styles.brand}>
                <Logo size={28} />
                <p>{config.appName}</p>
            </div>

            <button
                className={`${styles.sidebarButton} ${IsExpanded ? styles.expanded : ""}`}
                onClick={toggleExpansion}
                aria-label="Toggle sidebar"
            >
                <Sidebar size={20} />
            </button>
        </header>
    );
}
