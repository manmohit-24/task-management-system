import styles from "./SideBarHeader.module.css";
import Icon from "@/utils/Icons";
import config from "@/app/config";

export default function SideBarHeader({ IsExpanded, toggleExpansion }) {
    return (
        <header className={styles.container}>
            <div className={styles.brand}>
                <Icon name="IconLogo" size={"XL"} />
                <p>{config.appName}</p>
            </div>

            <button
                className={`${styles.sidebarButton} ${IsExpanded ? styles.expanded : ""}`}
                onClick={toggleExpansion}
                aria-label="Toggle sidebar"
            >
                <Icon name="IconSideBar" size={"M"} />
            </button>
        </header>
    );
}
