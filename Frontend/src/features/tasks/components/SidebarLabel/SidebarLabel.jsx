import styles from "./SidebarLabel.module.css";
import { useEffect, useState } from "react";
import { LayoutGrid, Pencil, Trash2, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { useUpdateProject, useDeleteProject } from "../../hooks/project.hooks";
import { useConfirmDelete } from "@/shared/confirmDelete";
import { InlineEditor } from "@/shared/components";
import { useNavigate } from "react-router-dom";

export default function SidebarLabel({
    id,
    name = "New Project",
    number = "",
    selected = false,
    onClick = () => {},
    color = "var(--text-disabled)",
    icon = <LayoutGrid size={20} />,
    allowEdits = true,
}) {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const { showConfirmDelete } = useConfirmDelete();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setFocus,
        setError,
        formState: { isDirty },
    } = useForm({
        defaultValues: {
            name,
            color,
        },
    });

    const { mutate: updateProject } = useUpdateProject({
        onError: (error) => setError(error),
    });
    const { mutate: deleteProject } = useDeleteProject();

    const watchedColor = watch("color");
    const watchedName = watch("name");

    // Open edit mode
    function startEditing(e) {
        e.stopPropagation();
        setIsEditing(true);
    }

    // Save
    function saveEdit(data, e) {
        e?.stopPropagation();

        updateProject({
            id,
            name: data.name,
            color: data.color,
        });

        reset({
            color: watchedColor,
            name: watchedName,
        });

        setIsEditing(false);
    }

    // Cancel + revert
    function cancelEdit() {
        reset({
            name,
            color,
        });

        setIsEditing(false);
    }

    // Delete
    function onDelete(e) {
        e.stopPropagation();

        showConfirmDelete({
            title: watchedName ? `Delete project "${watchedName}"?` : "Delete this project ?",
            description: (
                <>
                    All sections, todos, and related data inside this project will be permanently
                    deleted.
                    <br />
                    <br />
                    This action cannot be undone
                </>
            ),
            onConfirm: () => {
                deleteProject({ id });
                if (selected) navigate("/app/inbox");
            },
        });
    }

    // Autofocus
    useEffect(() => {
        if (isEditing) setFocus("name");
    }, [isEditing, setFocus]);

    if (!isEditing)
        return (
            <div
                id={id}
                onClick={() => onClick(id)}
                className={`${styles.container} ${selected ? styles.selected : ""}`}
                style={{ "--selectedColor": watchedColor }}
            >
                <div className={styles.content} onSubmit={handleSubmit(saveEdit)}>
                    <div className={styles.left}>
                        <div className={`${styles.icon} ${isEditing ? styles.iconEditMode : ""}`}>
                            {icon}
                        </div>
                        <span className={styles.name}>{watchedName}</span>
                    </div>

                    <div className={styles.right}>
                        {allowEdits ? (
                            <div className={styles.actions}>
                                <>
                                    <button className={styles.editButton} onClick={startEditing}>
                                        <Pencil size={14} />
                                    </button>

                                    <button className={styles.deleteButton} onClick={onDelete}>
                                        <Trash2 size={15} />
                                    </button>
                                </>
                            </div>
                        ) : (
                            <span className={styles.number}>{number}</span>
                        )}
                    </div>
                </div>
            </div>
        );

    return (
        <div
            id={id}
            className={`${styles.container} ${selected ? styles.selected : ""}`}
            style={{ "--selectedColor": watchedColor }}
        >
            <InlineEditor
                open={isEditing}
                onOpenChange={(open) => {
                    if (!open) {
                        cancelEdit();
                    }

                    setIsEditing(open);
                }}
            >
                <form className={styles.content} onSubmit={handleSubmit(saveEdit)}>
                    <div className={styles.left}>
                        <div className={`${styles.icon} ${isEditing ? styles.iconEditMode : ""}`}>
                            {icon}
                            <input type="color" {...register("color")} />
                        </div>
                        <input
                            className={styles.input}
                            onClick={(e) => e.stopPropagation()}
                            {...register("name", {
                                required: true,
                            })}
                        />
                    </div>

                    <div className={styles.right}>
                        <div className={styles.actions}>
                            <button
                                type="submit"
                                disabled={!isDirty}
                                className={styles.saveButton}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Check size={15} />
                            </button>
                        </div>
                    </div>
                </form>
            </InlineEditor>
        </div>
    );
}
