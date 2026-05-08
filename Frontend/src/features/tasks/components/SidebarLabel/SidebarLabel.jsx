import styles from "./SidebarLabel.module.css";
import { useEffect, useRef, useState } from "react";
import { LayoutGrid, Pencil, Trash2, Check } from "lucide-react";
import { useForm } from "react-hook-form";

export default function SidebarLabel({
    id,
    title = "New Project",
    number = "",
    selected = false,
    onClick = () => {},
    color = "var(--text-disabled)",
    icon = <LayoutGrid size={16} />,
    allowEdits = true,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const containerRef = useRef(null);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setFocus,
        formState: { isDirty },
    } = useForm({
        defaultValues: {
            title,
            color,
        },
    });

    const watchedColor = watch("color");
    const watchedTitle = watch("title");

    // Open edit mode
    function startEditing(e) {
        e.stopPropagation();
        setIsEditing(true);
    }

    // Save
    function saveEdit(data, e) {
        e?.stopPropagation();

        // backend update logic here

        console.log(data);
        reset({ color: watchedColor, title: watchedTitle });

        setIsEditing(false);
    }

    // Cancel + revert
    function cancelEdit() {
        reset({
            title,
            color,
        });

        setIsEditing(false);
    }

    // Delete
    function askDeleteConfirmation(e) {
        e.stopPropagation();

        // delete logic
    }

    // Autofocus
    useEffect(() => {
        if (isEditing) setFocus("title");
    }, [isEditing, setFocus]);

    // Outside click cancel
    useEffect(() => {
        if (!isEditing) return;

        function handlePointerDown(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) cancelEdit();
        }

        document.addEventListener("pointerdown", handlePointerDown);

        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [isEditing]);

    return (
        <div
            ref={containerRef}
            id={id}
            onClick={() => {
                if (!isEditing) onClick();
            }}
            className={`
                ${styles.container}
                ${selected ? styles.selected : ""}
            `}
            style={{
                "--selectedColor": watchedColor,
            }}
        >
            <form className={styles.content} onSubmit={handleSubmit(saveEdit)}>
                <div className={styles.left}>
                    <div className={`${styles.icon} ${isEditing ? styles.iconEditMode : ""}`}>
                        {icon}
                        {isEditing && <input type="color" {...register("color")} />}
                    </div>

                    {isEditing ? (
                        <input
                            className={styles.input}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                    cancelEdit();
                                }
                            }}
                            {...register("title", {
                                required: true,
                            })}
                        />
                    ) : (
                        <span className={styles.title}>{watchedTitle}</span>
                    )}
                </div>

                <div className={styles.right}>
                    {allowEdits ? (
                        <div className={styles.actions}>
                            {isEditing ? (
                                <button
                                    type="submit"
                                    disabled={!isDirty}
                                    className={styles.saveButton}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Check size={15} />
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className={styles.editButton}
                                        onClick={startEditing}
                                    >
                                        <Pencil size={14} />
                                    </button>

                                    <button
                                        type="button"
                                        className={styles.deleteButton}
                                        onClick={askDeleteConfirmation}
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <span className={styles.number}>{number}</span>
                    )}
                </div>
            </form>
        </div>
    );
}
