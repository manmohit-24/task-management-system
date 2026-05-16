import styles from "./TasksSection.module.css";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useConfirmDelete } from "@/app/providers/ConfirmDeleteProvider";
import Dropdown from "@/features/shared/components/Dropdown/Dropdown";

import {
    GripVertical,
    ChevronDown,
    Ellipsis,
    Pencil,
    Trash2,
    Copy,
    FolderInput,
} from "lucide-react";

export default function TasksSection({
    sectionId = "section-1",
    sectionName = "Backlog",
    todos = {},
    view = "List",
    onUpdateSection = (data) => {
        console.log("update", data);
    },
    onDeleteSection = (id) => {
        console.log("delete", id);
    },
}) {
    const { showConfirmDelete } = useConfirmDelete();

    const [collapsedTasks, setCollapsedTasks] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const containerRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setFocus,
        formState: { isDirty },
    } = useForm({
        defaultValues: {
            sectionName,
        },
    });

    const watchedSectionName = watch("sectionName");

    function startEditing(e) {
        e?.stopPropagation();

        setMenuOpen(false);
        setIsEditing(true);
    }

    function saveEdit(data) {
        onUpdateSection({
            sectionId,
            sectionName: data.sectionName,
        });

        reset({
            sectionName: data.sectionName,
        });

        setIsEditing(false);
    }

    function cancelEdit() {
        reset({
            sectionName,
        });

        setIsEditing(false);
    }

    function askDeleteConfirmation(e) {
        e?.stopPropagation();

        setMenuOpen(false);

        showConfirmDelete({
            title: watchedSectionName
                ? `Delete section "${watchedSectionName}" ?`
                : "Delete this section ?",

            description: "All tasks inside this section will be permanently deleted.",

            onConfirm: () => onDeleteSection(sectionId),
        });
    }

    const todosComponents = [];

    // autofocus
    useEffect(() => {
        if (isEditing) {
            setFocus("sectionName");
        }
    }, [isEditing, setFocus]);

    // outside click cancel
    useEffect(() => {
        if (!isEditing) return;

        function handlePointerDown(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                cancelEdit();
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [isEditing]);

    return (
        <section
            ref={containerRef}
            className={`
            ${styles.container}
            ${styles[`${view.toLowerCase()}View`]}
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
                                <h2>{watchedSectionName}</h2>

                                <p>{todosComponents.length}</p>
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
                        <div className={styles.editForm}>
                            <input
                                {...register("sectionName", {
                                    required: true,
                                })}
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") {
                                        cancelEdit();
                                    }
                                }}
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
                    )}
                </form>

                <div className={styles.separator} />
            </div>

            {/* CONTENT */}
            <div className={styles.content}>
                <div className={styles.todos}>{todosComponents}</div>

                <div className={styles.addTask}>{/* Todo Add Task Here  */}</div>
            </div>
        </section>
    );
}
