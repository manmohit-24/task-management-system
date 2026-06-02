import styles from "./SectionInlineForm.module.css";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { InlineEditor, Button } from "@/shared/components";

export default function SectionInlineForm({ open, onOpenChange, onSubmit, name = "" }) {
    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        formState: { isDirty, errors },
    } = useForm({
        defaultValues: { name },
    });

    // ===== Close Form =====
    const close = () => {
        reset({ name });
        onOpenChange(false);
    };

    // ===== Submit Form =====
    const submit = (data) => {
        if (!data.name.trim()) return;
        reset({});
        onSubmit?.(data);
        onOpenChange?.(false);
    };

    // ===== Auto-Focus to input =====
    useEffect(() => {
        if (open) setFocus("name");
    }, [open, setFocus]);

    return (
        <InlineEditor
            open={open}
            onOpenChange={(next) => {
                if (!next) close();
            }}
            className={styles.container}
        >
            <form className={styles.form} onSubmit={handleSubmit(submit)}>
                {/* ===== Input ===== */}
                <input
                    placeholder="Section name"
                    {...register("name", { required: "Section Name is required" })}
                />

                {/* ===== Error ===== */}
                <div className={styles.error}>{errors.name?.message}</div>

                {/* ===== Actions ===== */}
                <div className={styles.actions}>
                    <Button type="button" variant="secondary" onClick={close}>
                        Cancel
                    </Button>

                    <Button type="submit" disabled={!isDirty} variant="primary">
                        {name ? "Save" : "Add Section"}
                    </Button>
                </div>
            </form>
        </InlineEditor>
    );
}
