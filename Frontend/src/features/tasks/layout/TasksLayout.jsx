import { Sidebar } from "../components";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import styles from "./TasksLayout.module.css";

export default function TasksLayout() {
    const { id } = useParams();

    return (
        <div className={styles.page}>
            <Sidebar />
            <main className="DashboardMainContainer">
                <Outlet />
            </main>
        </div>
    );
}
