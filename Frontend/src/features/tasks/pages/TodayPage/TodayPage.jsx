import styles from "./TodayPage.module.css";
import { CalendarDays } from "lucide-react";

export default function TodayPage() {
    return (
        <main className={styles.container}>
            <div className={styles.content}>
                <CalendarDays size={56} strokeWidth={1.75} />

                <h1>Today</h1>

                <p>The Today view is under development and will be available soon.</p>
            </div>
        </main>
    );
}
