import styles from "./AddTask.module.css";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DatePickerDropdown, PrioritySelectorDropdown } from "../";
import { Expand, CirclePlus } from "lucide-react";

export default function AddTask({
    isForSubTask = false,
    sectionId = "NotSectioned",
    projectId = null,
    view = undefined,
    parentTaskId = undefined,
}) {
    const { register, handleSubmit, reset, setFocus } = useForm();

    const isToday = sectionId === "Today";

    const [dueDate, setDueDate] = useState(isToday ? new Date() : undefined);
    const [priority, setPriority] = useState(4);

    const [addingTask, setAddingTask] = useState(false);

    const title = isForSubTask ? "Add SubTask" : "Add Task";

    view = view || "list";

    sectionId = isToday ? "NotSectioned-inbox" : sectionId;

    const addTaskClick = async (formData, e) => {};

    const cancelAddingTask = () => {
        setAddingTask(false);
        reset();
    };

    useEffect(() => {
        if (addingTask) setFocus("task");
    }, [addingTask]);

    return (
        <div
            className={`
              ${styles.wrapper}
              ${addingTask ? styles.expanded : styles.collapsed}
              ${view == "board" ? styles.board : styles.list}
          `}
            onClick={(e) => {
                e.stopPropagation();

                if (!addingTask) {
                    setAddingTask(true);
                }
            }}
        >
            {!addingTask ? (
                <div className={styles.trigger}>
                    <span>
                        <CirclePlus size={16} />
                        Add Task
                    </span>
                </div>
            ) : (
                <form className={styles.container} onSubmit={handleSubmit(addTaskClick)}>
                    <div className={styles.content}>
                        <div className={styles.inputs}>
                            <textarea
                                className={styles.titleInput}
                                rows={1}
                                placeholder="Task..."
                                {...register("task", {
                                    onChange: (e) => {
                                        e.target.style.height = "auto";
                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                    },
                                })}
                            />

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

                        <div className={styles.actions}>
                            <DatePickerDropdown
                                value={dueDate}
                                onChange={setDueDate}
                                iconOnly
                                triggerClassName={styles.iconButton}
                            />

                            <PrioritySelectorDropdown
                                value={priority}
                                onChange={setPriority}
                                triggerClassName={styles.iconButton}
                            />

                            <button type="button" className={styles.iconButton}>
                                <Expand size={16} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.footer}>
                        <button
                            type="button"
                            className={`${styles.footerButton} ${styles.cancelButton}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                cancelAddingTask();
                            }}
                        >
                            <p>Cancel</p>
                        </button>

                        <button
                            type="submit"
                            className={`${styles.footerButton} ${styles.submitButton}`}
                        >
                            <p>{title}</p>
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
