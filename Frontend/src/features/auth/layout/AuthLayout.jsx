import { Outlet } from "react-router-dom";
import styles from "./AuthLayout.module.css";
import { Link } from "react-router-dom";
import config from "@/app/config";
import HeaderThemeToggle from "../components/HeaderThemeToggle/HeaderThemeToggle";
import Icon from "@/utils/Icons";

const AuthLayout = () => {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <Link to="/" className={styles.brand}>
                    <div className={styles.logo}>
                        <Icon name="IconLogo" size="L" />
                    </div>

                    <div className={styles.brandText}>
                        <span className={styles.title}>{config.appName}</span>
                        <span className={styles.subtitle}>Organize work and life, simply.</span>
                    </div>
                </Link>

                <HeaderThemeToggle />
            </header>

            <main className={styles.body}>
                <Outlet />
            </main>
        </div>
    );
};

export default AuthLayout;
