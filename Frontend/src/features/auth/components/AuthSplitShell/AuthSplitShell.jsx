import { Link } from "react-router-dom";
import styles from "./AuthSplitShell.module.css";
import HeaderThemeToggle from "../HeaderThemeToggle/HeaderThemeToggle";
import Icon from "@/utils/Icons";
import config from "@/app/config";

export default function AuthSplitShell({ children }) {
    return (
        <main className={styles.page}>
            <section className={styles.shell}>
                <aside className={styles.showcase}>
                    <Link to="/" className={styles.brand}>
                        <Icon name="IconLogo" addionalclasses={styles.logo} />

                        <div className={styles.brandText}>
                            <span className={styles.title}>{config.appName}</span>
                            <span className={styles.tagline}>Organize work and life, simply.</span>
                        </div>
                    </Link>

                    <div className={styles.pitch}>
                        <h1 className={styles.pitchTitle}>Stay organized without the clutter.</h1>
                        <p className={styles.pitchText}>
                            A calm workspace for tasks, notes, and everyday planning. Built to help
                            us focus on what matters and finish work with less noise.
                        </p>
                    </div>
                    <div className={styles.previewCard}></div>
                </aside>

                <section className={styles.panel}>
                    <div className={styles.themeToggle}>
                        <HeaderThemeToggle />
                    </div>

                    <div className={styles.formShell}>{children} </div>
                </section>
            </section>
        </main>
    );
}
