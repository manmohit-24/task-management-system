import "./TodoAddTask.css";
import Icon from "../../../utils/Icons";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import todoService from "../../../services/TodoServices";
import { addTodo, setEditingTaskId, addSubTask } from "../../../store/Features/TodoSlice";
import TodoDatePicker from "../../../features/shared/components/DatePicker/DatePicker";
import { getRelativeDueDate } from "@/features/shared/libs/relativeDueDate";
const TodoAddTask = ({
    isForSubTask = false,
    sectionId = "NotSectioned",
    view = undefined,
    parentTaskId = undefined,
}) => {
    const dispatch = useDispatch();

    const { register, handleSubmit, reset, setFocus, watch } = useForm();

    const isToday = sectionId === "Today";

    const [dueDate, setDueDate] = useState(isToday ? new Date() : undefined);
    const [expandedDatePicker, setExpandedDatePicker] = useState(false);
    const [dateIconColor, setDateIconColor] = useState("var(--Disabled)");
    const datePickerRef = useRef(null);

    const [priority, setPriority] = useState(4);
    const [prioritySelectorExpanded, setPrioritySelectorExpanded] = useState(false);
    const prioritySelectorRef = useRef(null);

    const [addingTask, setAddingTask] = useState(false);

    const email = useSelector((state) => state.AuthData.Email);
    const token = useSelector((state) => state.AuthData.Token);
    const title = isForSubTask ? "Add SubTask" : "Add Task";
    view = view || useSelector((state) => state.TodoData.View);
    sectionId = isToday ? "NotSectioned-inbox" : sectionId;

    const contianerClassName = `TodoAddTaskContainer ${addingTask ? "AddingTask" : ""} ${view}View`;

    const addTaskClick = async (formData, e) => {
        const buttonName = e.nativeEvent.submitter.name; // which button was clicked

        let todoId = `t${
            String.fromCharCode(Math.floor(Math.random() * 26) + 97) + Math.floor(Math.random() * 9)
        }`;

        if (!addingTask) {
            setFocus("task");
            setAddingTask(true);
        } else if (buttonName === "more" || (addingTask && formData.task)) {
            let data = {
                task: formData.task,
                description: formData.description,
                priority: priority,
                dueDate: dueDate?.toString(),
                sectionId: sectionId,
                completed: false,
                subTasks: {},
            };

            const { message, success /* data */ } = await todoService.addTodo({
                email,
                token,
                todo: data,
            });

            if (success) {
                if (isForSubTask) dispatch(addSubTask({ parentTaskId, todoId, todo: data }));
                else dispatch(addTodo({ todoId, todo: data }));

                if (buttonName === "more") {
                    dispatch(setEditingTaskId({ todoId: todoId }));
                }
                cancelAddingTask();
            }
        }
    };
    const cancelAddingTask = () => {
        setAddingTask(false);
        reset();
        setExpandedDatePicker(false);
        setPrioritySelectorExpanded(false);
        setDueDate(isToday ? new Date() : undefined);
        setPriority(4);
    };

    useEffect(() => {
        setDateIconColor(getRelativeDueDate(dueDate)[1]);
    }, [dueDate]);

    useEffect(() => {
        if (addingTask) {
            setFocus("task");
        }
    }, [addingTask]);

    useEffect(() => {
        if (expandedDatePicker) {
            datePickerRef.current.focus();
        }
    }, [expandedDatePicker]);

    useEffect(() => {
        if (prioritySelectorExpanded) {
            prioritySelectorRef.current.focus();
        }
    }, [prioritySelectorExpanded]);

    useEffect(() => {
        const dropdowns = [
            { ref: datePickerRef, close: () => setExpandedDatePicker(false) },
            { ref: prioritySelectorRef, close: () => setPrioritySelectorExpanded(false) },
        ];

        const handleClickOutside = (e) => {
            dropdowns.forEach(({ ref, close }) => {
                if (ref.current && !ref.current.contains(e.target)) {
                    close();
                }
            });
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <form
            className={contianerClassName}
            onSubmit={handleSubmit(addTaskClick)}
            onClick={(e) => {
                e.stopPropagation();
                if (!addingTask) setAddingTask(true);
            }}
        >
            {/* {addingTask && ( */}
            <>
                <div className="TodoAddTaskContentContainer">
                    <div className="TodoAddTaskInputContainer">
                        <textarea
                            className="TodoAddTaskTitleInput"
                            rows={1}
                            placeholder="Task..."
                            {...register("task", {
                                onChange: (e) => {
                                    e.target.style.height = "auto"; // reset to shrink if needed
                                    e.target.style.height = `${e.target.scrollHeight}px`; // set to fit
                                },
                            })}
                        />
                        <textarea
                            className="TodoAddTaskDescriptionInput"
                            rows={1}
                            placeholder="Description..."
                            {...register("description", {
                                onChange: (e) => {
                                    e.target.style.height = "auto"; // reset to shrink if needed
                                    e.target.style.height = `${e.target.scrollHeight}px`; // set to fit
                                },
                            })}
                        />
                    </div>

                    <div className="TodoAddTaskRightButtons">
                        <button
                            type="button"
                            className="TodoAddTaskDateButton"
                            onClick={() => setExpandedDatePicker(!expandedDatePicker)}
                            style={{ "--IconColor": dateIconColor }}
                        >
                            <Icon name={"IconCalendar2"} />
                        </button>

                        {expandedDatePicker && (
                            <div ref={datePickerRef} className="TodoAddTaskDatePickerContainer">
                                <TodoDatePicker dueDate={dueDate} setDateValue={setDueDate} />
                            </div>
                        )}

                        <button
                            type="button"
                            className="TodoAddTaskPriorityButton"
                            id={`P${priority}Flag`}
                            onClick={() => setPrioritySelectorExpanded(!prioritySelectorExpanded)}
                        >
                            <Icon name={"IconFlag"} />
                        </button>

                        {prioritySelectorExpanded && (
                            <div
                                className="TodoAddTaskPrioritySelectorContainer"
                                ref={prioritySelectorRef}
                            >
                                <button id="P1Flag" type="button" onClick={() => setPriority(1)}>
                                    <Icon name={"IconFlag"} />
                                    <span>P1</span>
                                </button>
                                <button id="P2Flag" type="button" onClick={() => setPriority(2)}>
                                    <Icon name={"IconFlag"} />
                                    <span>P2</span>
                                </button>
                                <button id="P3Flag" type="button" onClick={() => setPriority(3)}>
                                    <Icon name={"IconFlag"} />
                                    <span>P3</span>
                                </button>
                                <button id="P4Flag" type="button" onClick={() => setPriority(4)}>
                                    <Icon name={"IconFlag"} />
                                    <span>P4</span>
                                </button>
                            </div>
                        )}

                        <button type="submit" className="TodoAddTaskMoreButton" name="more">
                            <Icon name={"IconDots3"} />
                        </button>
                    </div>
                </div>

                <div className="TodoAddTaskDivider" />
            </>
            {/* )} */}

            <div className="TodoAddTaskBottomButtons">
                <button
                    type="button"
                    className="TodoAddTaskCancelButton"
                    onClick={cancelAddingTask}
                >
                    <Icon name={"IconPlusFilled"} />
                    <p>Cancel</p>
                </button>

                <button className="TodoAddTaskAddButton" type="submit" name="add">
                    <Icon name={"IconPlusFilled"} />
                    <p>{title}</p>
                </button>
            </div>
        </form>
    );
};

export default TodoAddTask;
