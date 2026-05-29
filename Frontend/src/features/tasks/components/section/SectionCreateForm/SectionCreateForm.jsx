import styles from "./SectionCreateForm.module.css";
import { useCreateSection } from "@/features/tasks/hooks/section.hooks";

import { SectionInlineForm } from "..";
import { toast } from "sonner";
import { AddSection } from "@/shared/icons";

export default function SectionCreateForm({
    open = false,
    onOpenChange = () => {},
    view = "list",
    project,
}) {
    const { mutate: createSection } = useCreateSection({
        onError: (error) => toast.error(error.message),
    });

    const submit = (data) => {
        if (!data.name.trim()) return;

        createSection({
            name: data.name,
            project,
        });

        onOpenChange(false);
    };

    return (
        <div className={`${styles.container} ${styles[`${view}View`]}`}>
            {!open ? (
                <button className={styles.trigger} onClick={() => onOpenChange(true)}>
                    <AddSection size={18} strokeWidth={2.2} />
                    <span>Add Section</span>
                </button>
            ) : (
                <SectionInlineForm open={open} onOpenChange={onOpenChange} onSubmit={submit} />
            )}
        </div>
    );
}
