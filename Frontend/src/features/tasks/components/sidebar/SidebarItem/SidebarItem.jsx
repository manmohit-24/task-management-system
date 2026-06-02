import styles from "./SidebarItem.module.css";
import { useState } from "react";
import { useUpdateProject, useDeleteProject } from "@/features/tasks/hooks/project.hooks";
import { useNavigate } from "react-router-dom";
import { useConfirmDelete } from "@/shared/confirmDelete";

import { InlineEditor } from "@/shared/components";
import { SidebarProjectForm } from "..";
import { toast } from "sonner";
import { LayoutGrid, Pencil, Trash2 } from "lucide-react";

export default function SidebarItem({
    id,
    name = "New Project",
    number = "",
    selected = false,
    color = "var(--text-secondary)",
    icon: Icon = LayoutGrid,
    allowEdits = true,
    onActionInProgressChange,
}) {
    // ===== Navigation =====
    const navigate = useNavigate();

    const handleNavigation = (projectId) => {
        navigate(`/app/${projectId}`);
    };

    // ===== Editing State =====
    const [isEditing, setIsEditing] = useState(false);

    // Open edit mode
    const handleStartEditing = (e) => {
        e.stopPropagation();
        setIsEditing(true);
        onActionInProgressChange(true);
    };

    // ===== onOpenChange for Inline Editor =====
    const handleEditorOpenChange = (open) => {
        setIsEditing(open);
        onActionInProgressChange(open);
    };

    // ===== Update Project =====
    const { mutate: updateProject } = useUpdateProject({
        onError: (error) => toast.error(error.message),
    });

    const handleSaveEdits = (data) => {
        updateProject({
            id,
            name: data.name,
            color: data.color,
        });
        setIsEditing(false);
        onActionInProgressChange(false);
    };

    // ===== Delete Project =====
    const { mutate: deleteProject } = useDeleteProject({
        onError: (error) => toast.error(error.message),
        onSuccess: () => {
            if (selected) handleNavigation("inbox");
        },
    });
    const { showConfirmDelete } = useConfirmDelete();

    const handleDelete = (e) => {
        e.stopPropagation();
        onActionInProgressChange(true);

        showConfirmDelete({
            title: name ? `Delete project "${name}"?` : "Delete this project ?",
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
                onActionInProgressChange(false);
                deleteProject({ id });
            },
            onCancel: () => onActionInProgressChange(false),
        });
    };

    return (
        <div
            id={id}
            onClick={() => !isEditing && handleNavigation(id)}
            className={`${styles.container} ${selected ? styles.selected : ""}`}
            style={{ "--selectedColor": color }}
        >
            {!isEditing ? (
                /* ===== Show Item if not editing ===== */

                <div className={styles.content}>
                    {/* ===== Left -> Icon + Name ===== */}
                    <div className={styles.left}>
                        <div className={styles.icon}>
                            <Icon size={20} />
                        </div>
                        <span className={styles.name}>{name}</span>
                    </div>

                    {/* ===== Right -> Number or Edit + Delete Button ===== */}
                    <div className={styles.right}>
                        {allowEdits ? (
                            /* ===== Edit + Delete Button ===== */
                            <div className={styles.actions}>
                                <button className={styles.editButton} onClick={handleStartEditing}>
                                    <Pencil size={14} />
                                </button>

                                <button className={styles.deleteButton} onClick={handleDelete}>
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ) : (
                            /* ===== Number ===== */
                            <span className={styles.number}>{number}</span>
                        )}
                    </div>
                </div>
            ) : (
                /* ===== Edit Form ===== */

                <InlineEditor open={isEditing} onOpenChange={handleEditorOpenChange}>
                    <SidebarProjectForm
                        initial={{ name, color, icon: Icon }}
                        onSubmit={handleSaveEdits}
                    />
                </InlineEditor>
            )}
        </div>
    );
}
