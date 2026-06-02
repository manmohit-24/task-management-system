import styles from "./TaskCreateForm.module.css";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useCreateTask } from "@/features/tasks/hooks/tasks.hooks";
import { useViewMode } from "@/features/tasks/TaskLayoutProvider/TaskLayoutProvider";

import { Button } from "@/shared/components";
import { DatePickerMenu, PrioritySelectorMenu } from "..";
import { CirclePlus } from "lucide-react";
import { toast } from "sonner";

export default function TaskCreateForm({ section, project, parentId = null }) {
    const { view } = useViewMode();
    const triggerLabel = parentId ? "Add SubTask" : "Add Task";
    const [addingTask, setAddingTask] = useState(false);

    // ===== Form =====
    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: { content: "", description: "", dueDate: undefined, priority: 4 },
    });

    // ===== Create Task Mutations =====
    const { mutate: createTask } = useCreateTask({
        onError: (error) => toast.error(error.message),
        onSuccess: () => {
            setAddingTask(false);
            reset();
        },
    });

    // ===== Submit =====
    const handleCreateTask = (data) => {
        createTask({ ...data, project, section, parentId });
    };

    // ===== Cancel =====
    const handleCancel = () => {
        setAddingTask(false);
        reset();
    };

    // ===== Autofocus =====
    useEffect(() => {
        if (addingTask) setFocus("content");
    }, [addingTask, setFocus]);

    return (
        <div
            className={`
              ${styles.wrapper}
              ${addingTask ? styles.expanded : styles.collapsed}
              ${view == "board" ? styles.board : styles.list}
          `}
        >
            {!addingTask ? (
                /* ===== Trigger ===== */
                <button className={styles.trigger} onClick={() => setAddingTask(true)}>
                    <span>
                        <CirclePlus size={16} />
                        {triggerLabel}
                    </span>
                </button>
            ) : (
                /* ===== Form ===== */
                <form className={styles.container} onSubmit={handleSubmit(handleCreateTask)}>
                    <div className={styles.content}>
                        <div className={styles.inputs}>
                            {/* ===== Content ===== */}
                            <textarea
                                className={styles.titleInput}
                                rows={1}
                                placeholder="Task..."
                                {...register("content", {
                                    required: "Please enter a Task content",
                                    onChange: (e) => {
                                        e.target.style.height = "auto";
                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                    },
                                })}
                            />

                            {/* ===== Description ===== */}
                            <textarea
                                className={styles.descriptionInput}
                                rows={1}
                                placeholder="Description..."
                                {...register("description", {
                                    onChange: (e) => {
                                        e.target.style.height = "auto";
                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                    },
                                })}
                            />
                        </div>

                        <div className={styles.menuButtons}>
                            {/* ===== Date Picker Menu ===== */}
                            <Controller
                                name="dueDate"
                                control={control}
                                render={({ field }) => (
                                    <DatePickerMenu
                                        value={field.value}
                                        onChange={field.onChange}
                                        debounceMs={0}
                                    />
                                )}
                            />

                            {/* ===== Priority Selector Menu ===== */}
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field }) => (
                                    <PrioritySelectorMenu
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className={styles.seperator} />

                    <div className={styles.footer}>
                        {/* ===== Footer Buttons ===== */}
                        <div className={styles.actions}>
                            <Button type="button" variant="secondary" onClick={handleCancel}>
                                <p>Cancel</p>
                            </Button>

                            <Button type="submit">
                                <p>{triggerLabel}</p>
                            </Button>
                        </div>{" "}
                        {/* ===== Error ===== */}
                        <div className={styles.error}>{errors.content?.message}</div>
                    </div>
                </form>
            )}
        </div>
    );
}
