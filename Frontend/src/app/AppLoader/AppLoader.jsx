import styles from "./AppLoader.module.css";
import { Logo } from "@/shared/icons";

export default function AppLoader() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Logo size={50} />

                <div className={styles.spinner}>
                    <span />
                    <span />
                    <span />
                </div>
            </div>
        </div>
    );
}
