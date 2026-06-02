import styles from "./ProjectNotFoundPage.module.css";
import { Link } from "react-router-dom";
import { FolderX } from "lucide-react";

export default function ProjectNotFoundPage() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <FolderX size={56} strokeWidth={1.75} />

                <h1>Project Not Found</h1>

                <p>The project may have been deleted, moved, or the link is invalid.</p>

                <Link to="/app/inbox" className={styles.button}>
                    Go to Inbox
                </Link>
            </div>
        </div>
    );
}
