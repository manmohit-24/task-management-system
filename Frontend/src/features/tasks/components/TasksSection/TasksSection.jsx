import styles from "./TasksSection.module.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useConfirmDelete } from "@/app/providers/ConfirmDeleteProvider";
import { Dropdown, InlineEditor } from "@/features/shared/components/";
import { useDeleteSection, useUpdateSection } from "../../hooks/section.hooks";
import { MOCK_TASKS } from "./mockTasks.jsx";
import { TaskCard, AddTask } from "../";

import {
    GripVertical,
    ChevronDown,
    Ellipsis,
    Pencil,
    Trash2,
    Copy,
    FolderInput,
} from "lucide-react";

export default function TasksSection({ id, name = "Backlog", view = "list", projectId }) {
    const { showConfirmDelete } = useConfirmDelete();
    const { mutate: deleteSection } = useDeleteSection();
    const { mutate: updateSection } = useUpdateSection();

    const [collapsedTasks, setCollapsedTasks] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setFocus,
        formState: { isDirty },
    } = useForm({
        defaultValues: { name },
    });

    const watchedName = watch("name");

    const startEditing = (e) => {
        e?.stopPropagation();

        setMenuOpen(false);
        setIsEditing(true);
    };

    const saveEdit = (data) => {
        updateSection({ id, name: data.name, projectId });
        reset({
            name: data.name,
        });

        setIsEditing(false);
    };

    function cancelEdit() {
        reset({
            name: name,
        });

        setIsEditing(false);
    }

    function askDeleteConfirmation(e) {
        e?.stopPropagation();

        setMenuOpen(false);
        showConfirmDelete({
            title: watchedName ? `Delete section "${watchedName}" ?` : "Delete this section ?",

            description: "All tasks inside this section will be permanently deleted.",

            onConfirm: () => deleteSection({ id, projectId }),
        });
    }

    const todos = MOCK_TASKS;

    // autofocus
    useEffect(() => {
        if (isEditing) {
            setFocus("name");
        }
    }, [isEditing, setFocus]);

    return (
        <section
            className={`
            ${styles.container}
            ${styles[`${view}View`]}
            ${collapsedTasks ? styles.collapsed : ""}
        `}
        >
            {/* HEADER */}
            <div className={styles.heading}>
                <div className={styles.headingLeft}>
                    <button className={styles.iconButton}>
                        <GripVertical size={18} strokeWidth={1.75} />{" "}
                    </button>

                    <button
                        className={styles.iconButton}
                        onClick={() => setCollapsedTasks((prev) => !prev)}
                    >
                        <ChevronDown
                            size={18}
                            strokeWidth={2}
                            className={`${styles.chevron} ${
                                collapsedTasks ? styles.chevronCollapsed : ""
                            }`}
                        />{" "}
                    </button>
                </div>

                <form className={styles.headingContent} onSubmit={handleSubmit(saveEdit)}>
                    {!isEditing ? (
                        <>
                            <div className={styles.title}>
                                <h2>{watchedName}</h2>
                                <p>{todos.length}</p>
                            </div>

                            <Dropdown
                                open={menuOpen}
                                onOpenChange={setMenuOpen}
                                className={{
                                    trigger: styles.dropdownTrigger,
                                    menu: styles.dropdownMenu,
                                }}
                                trigger={
                                    <button type="button" className={styles.actionButton}>
                                        <Ellipsis size={18} strokeWidth={2} />{" "}
                                    </button>
                                }
                            >
                                <button
                                    type="button"
                                    className={styles.dropdownItem}
                                    onClick={startEditing}
                                >
                                    <Pencil size={14} /> Edit
                                </button>

                                <button type="button" className={styles.dropdownItem}>
                                    <Copy size={14} /> Duplicate
                                </button>

                                <button type="button" className={styles.dropdownItem}>
                                    <FolderInput size={14} /> Move
                                </button>

                                <button
                                    type="button"
                                    className={`${styles.dropdownItem} ${styles.deleteItem}`}
                                    onClick={askDeleteConfirmation}
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </Dropdown>
                        </>
                    ) : (
                        <InlineEditor
                            open={isEditing}
                            onOpenChange={(open) => {
                                if (!open) cancelEdit();
                                setIsEditing(open);
                            }}
                        >
                            <div className={styles.editForm}>
                                <input
                                    {...register("name", {
                                        required: true,
                                    })}
                                />

                                <div className={styles.editActions}>
                                    <button type="button" onClick={cancelEdit}>
                                        Cancel
                                    </button>

                                    <button type="submit" disabled={!isDirty}>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </InlineEditor>
                    )}
                </form>

                <div className={styles.separator} />
            </div>

            {/* CONTENT */}
            <div className={styles.content}>
                <div className={styles.todos}>
                    {todos.map((task) => (
                        <TaskCard key={task.id} {...task} view={view} />
                    ))}
                    <AddTask view={view} />
                </div>
            </div>
        </section>
    );
}
