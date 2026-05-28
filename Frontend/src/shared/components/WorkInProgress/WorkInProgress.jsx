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
                    This feature is currently running in UI-only mode. Backend integration is still
                    in progress, so some actions may be unavailable or non-functional for now.
                </p>
            </div>
        </div>
    );
}
