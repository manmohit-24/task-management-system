import { Outlet } from "react-router-dom";
import Icon from "@/utils/Icons";
import styles from "../styles/AuthPage.module.css";
const AuthLayout = () => {
    return (
        <div className={styles.container}>
            <Icon name={"IconLogo"} addionalclasses={styles.logo} />
            <div className={styles.formContainer}>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
