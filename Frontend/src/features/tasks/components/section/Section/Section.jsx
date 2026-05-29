import styles from "./Section.module.css";
import { useState } from "react";

import { useConfirmDelete } from "@/shared/confirmDelete";
import { useDeleteSection, useUpdateSection } from "@/features/tasks/hooks/section.hooks";
import { useTasks } from "@/features/tasks/hooks/tasks.hooks.js";

import { WorkInProgressTooltip, WorkInProgress, ActionsMenu } from "@/shared/components";
import { TaskCard, AddTask } from "../..";
import { SectionInlineForm } from "..";
import { toast } from "sonner";

import {
    GripVertical,
    ChevronDown,
    Ellipsis,
    Pencil,
    Trash2,
    Copy,
    FolderInput,
} from "lucide-react";

export default function Section({ id, name = "Section Name", view = "list", project }) {
    // ===== Edit Section Name =====
    const [isEditing, setIsEditing] = useState(false);
    const { mutate: updateSection } = useUpdateSection({
        onError: (error) => toast.error(error.message),
    });

    const saveEdit = (data) => {
        updateSection({ id, name: data.name, project });
        setIsEditing(false);
    };

    // ===== Delete Section =====
    const { showConfirmDelete } = useConfirmDelete();
    const { mutate: deleteSection } = useDeleteSection({
        onError: (error) => toast.error(error.message),
    });

    const askDeleteConfirmation = () => {
        showConfirmDelete({
            title: name ? `Delete section "${name}" ?` : "Delete this section ?",
            description: "All tasks inside this section will be permanently deleted.",
            onConfirm: () => deleteSection({ id, project }),
        });
    };

    // ===== Tasks Content =====
    const [collapsedTasks, setCollapsedTasks] = useState(false);
    const { data } = useTasks({ projectId: project, sectionId: id, parentTaskId: null });
    const todos = data ?? [];

    // ===== Menu Items =====
    const menuItems = [
        {
            label: "Edit",
            icon: Pencil,
            onClick: () => setIsEditing(true),
        },
        {
            label: "Duplicate",
            icon: Copy,
            onClick: () => toast(WorkInProgress),
        },
        {
            label: "Move",
            icon: FolderInput,
            onClick: () => toast(WorkInProgress),
        },
        {
            type: "separator",
        },
        {
            label: "Delete",
            icon: Trash2,
            className: styles.deleteItem,
            onClick: () => askDeleteConfirmation(),
        },
    ];

    return (
        <section
            className={`
            ${styles.container}
            ${styles[view]}
            ${collapsedTasks ? styles.collapsed : ""}
        `}
        >
            {/* ===== HEADER ===== */}
            <div className={styles.heading}>
                {/* ===== Header Left Icons ===== */}
                <div className={styles.headingLeft}>
                    <WorkInProgressTooltip>
                        <button className={`${styles.iconButton} ${styles.dragButton}`}>
                            <GripVertical size={18} strokeWidth={1.75} />{" "}
                        </button>
                    </WorkInProgressTooltip>

                    <button
                        className={styles.iconButton}
                        onClick={() => setCollapsedTasks((prev) => !prev)}
                    >
                        <ChevronDown
                            size={18}
                            className={`${styles.chevron} ${collapsedTasks ? styles.chevronCollapsed : ""}`}
                        />
                    </button>
                </div>

                {!isEditing ? (
                    /* ===== Heading ===== */
                    <div className={styles.headingContent}>
                        <div className={styles.title}>
                            <h2>{name}</h2>
                            <p>{todos.length}</p>
                        </div>

                        {/* ===== Action Menu ===== */}
                        <ActionsMenu items={menuItems}>
                            <button type="button" className={styles.actionButton}>
                                <Ellipsis size={18} strokeWidth={2} />
                            </button>
                        </ActionsMenu>
                    </div>
                ) : (
                    /* ===== Editor ===== */
                    <SectionInlineForm
                        open={isEditing}
                        onOpenChange={setIsEditing}
                        name={name}
                        onSubmit={saveEdit}
                    />
                )}
                <div className={styles.separator} />
            </div>

            {/* ===== CONTENT ===== */}
            <div className={styles.content}>
                <div className={styles.todos}>
                    {todos.map((task) => (
                        <TaskCard key={task._id} {...task} id={task._id} view={view} />
                    ))}
                    <AddTask view={view} sectionId={id} project={project} />
                </div>
            </div>
        </section>
    );
}
