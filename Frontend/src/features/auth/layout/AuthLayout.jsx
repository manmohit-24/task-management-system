import { Outlet } from "react-router-dom";
import styles from "../styles/AuthPage.module.css";
const AuthLayout = () => {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
