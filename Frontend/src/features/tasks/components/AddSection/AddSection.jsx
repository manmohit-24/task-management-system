import styles from "./AddSection.module.css";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { InlineEditor } from "@/features/shared/components";
import { AddSection as AddSectionIcon } from "@/features/shared/components/Icons";

export default function AddSection({ open = false, onOpenChange = () => {}, view = "list" }) {
    const { register, handleSubmit, reset, setFocus, watch } = useForm({
        defaultValues: { name: "" },
    });

    const createSection = (data) => {
        console.log(data);
    };

    const watchedSectionName = watch("name");

    const closeForm = () => {
        reset();
        onOpenChange(false);
    };

    const submit = (data) => {
        if (!data.name.trim()) return;

        createSection({
            name: data.name,
        });

        reset();
        onOpenChange(false);
    };

    // autofocus
    useEffect(() => {
        if (open) setFocus("name");
    }, [open, setFocus]);

    return (
        <div className={`${styles.container} ${styles[`${view}View`]}`}>
            {!open ? (
                <button className={styles.trigger} onClick={() => onOpenChange(true)}>
                    <AddSectionIcon size={18} strokeWidth={2.2} />
                    <span>Add Section</span>
                </button>
            ) : (
                <InlineEditor
                    open={open}
                    onOpenChange={(next) => {
                        if (!next) {
                            closeForm();
                        }
                    }}
                >
                    <form className={styles.form} onSubmit={handleSubmit(submit)}>
                        <input placeholder="Section name" {...register("name")} />

                        <div className={styles.actions}>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={closeForm}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={!watchedSectionName.trim()}
                                className={styles.submitButton}
                            >
                                Add Section
                            </button>
                        </div>
                    </form>
                </InlineEditor>
            )}
        </div>
    );
}
