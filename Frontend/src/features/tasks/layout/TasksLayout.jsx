import styles from "./TasksLayout.module.css";
import { Sidebar, Toolbar } from "../components";

export default function TasksLayout() {
    return (
        <div className={styles.page}>
            <Sidebar />
            <main className={styles.body}>
                <Toolbar />
                {/* Page Component Here */}
            </main>
        </div>
    );
}
