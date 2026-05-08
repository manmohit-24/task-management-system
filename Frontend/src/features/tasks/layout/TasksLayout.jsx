import { Sidebar } from "../components";
import { Outlet } from "react-router-dom";
import styles from "./TasksLayout.module.css";

export default function TasksLayout() {
    return (
        <div className={styles.page}>
            <Sidebar />
            <main className="DashboardMainContainer">
                <Outlet />
            </main>
        </div>
    );
}
