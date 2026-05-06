import { Link } from "react-router-dom";
import styles from "./AuthCenteredShell.module.css";
import config from "@/app/config";
import HeaderThemeToggle from "../HeaderThemeToggle/HeaderThemeToggle";
import Icon from "@/utils/Icons";

export default function AuthCenteredShell({ children }) {
    return (
        <div className={styles.page}>
            <div className={styles.bgGlowTop} />
            <div className={styles.bgGlowBottom} />
            <div className={styles.bgPattern} />

            <header className={styles.header}>
                <Link to="/" className={styles.brand}>
                    <Icon name="IconLogo" addionalclasses={styles.logo} />

                    <div className={styles.brandText}>
                        <span className={styles.title}>{config.appName}</span>
                        <span className={styles.subtitle}>Organize work and life, simply.</span>
                    </div>
                </Link>

                <HeaderThemeToggle />
            </header>

            <main className={styles.body}>
                <section className={styles.authShell}>{children}</section>
            </main>
        </div>
    );
}
