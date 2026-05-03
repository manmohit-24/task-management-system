import { Outlet } from "react-router-dom";
import styles from "../styles/AuthPage.module.css";
const AuthLayout = () => {
    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
