import styles from "./SidebarProjectForm.module.css";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/components";
import { LayoutGrid } from "lucide-react";
import { Tick } from "@/shared/icons";

export default function SidebarProjectForm({
    initial = { name: "", color: "", icon: LayoutGrid },
    onSubmit,
    variant = "edit",
}) {
    const { icon: Icon, ...rest } = initial;

    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        watch,
        formState: { isDirty },
    } = useForm({
        defaultValues: rest,
    });

    const watchColor = watch("color");

    const submit = (data) => {
        onSubmit?.(data);
        reset();
    };

    // ===== Autofocus =====
    useEffect(() => {
        setFocus("name");
    }, [setFocus]);

    return (
        <form className={`${styles.form} ${styles[variant]}`} onSubmit={handleSubmit(submit)}>
            {/* ===== Left / Top -> Inputs ===== */}

            <div className={styles.left}>
                {/* ===== Color Input ===== */}
                <div className={styles.icon} style={{ "--selectedColor": watchColor }}>
                    <Icon size={20} />
                    <input type="color" {...register("color")} />
                </div>

                {/* ===== Name Input ===== */}
                <input
                    className={styles.input}
                    onClick={(e) => e.stopPropagation()}
                    {...register("name", {
                        required: "Name is required",
                    })}
                />
            </div>

            {/* ===== Right / Bottom -> Actions ===== */}

            <div className={styles.right}>
                <Button
                    type="submit"
                    disabled={!isDirty}
                    className={styles.submitButton}
                    onClick={(e) => e.stopPropagation()}
                >
                    {variant === "edit" ? <Tick size={12} /> : "Add Project"}
                </Button>
            </div>
        </form>
    );
}
