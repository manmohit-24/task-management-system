import styles from "./WorkInProgress.module.css";
import { Settings } from "lucide-react";
export default function WorkInProgress() {
    return (
        <div className={styles.placeholderState}>
            <div className={styles.placeholderIcon}>
                <Settings size={20} />
            </div>

            <div className={styles.placeholderContent}>
                <h2 className={styles.placeholderTitle}>Feature in Progress</h2>
                <p className={styles.placeholderText}>
                    This feature is currently UI-only and non-functional.{" "}
                </p>
            </div>
        </div>
    );
}
