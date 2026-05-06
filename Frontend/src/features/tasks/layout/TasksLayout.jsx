import { SideBar } from "../components";
import { Outlet } from "react-router-dom";
import styles from "./TasksLayout.module.css";

export default function TasksLayout() {
    return (
        <div className={styles.page}>
            <SideBar />
            <main className="DashboardMainContainer">
                <Outlet />
            </main>
        </div>
    );
}
