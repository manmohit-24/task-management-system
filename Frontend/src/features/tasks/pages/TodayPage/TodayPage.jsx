import styles from "./TodayPage.module.css";
import { useEffect } from "react";
import { useViewMode } from "../../TaskLayoutProvider/TaskLayoutProvider";
import { useTodayPageTasks } from "@/features/tasks/hooks/tasks.hooks.js";

import { TodaySection } from "../../components/section";
import { toast } from "sonner";

export default function TodayPage() {
    const { view } = useViewMode();
    const { data, error } = useTodayPageTasks();
    const { today, overdue } = data ?? { overdue: [], today: [] };

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);
    return (
        <main className={`${styles.container} ${styles[view]}`}>
            <div className={styles.section}>
                <TodaySection type="overdue" todos={overdue} />
            </div>
            <div className={styles.section}>
                <TodaySection type="today" todos={today} />
            </div>
        </main>
    );
}
