import { useState, useRef, useEffect } from "react";
import "./TodoEditTask.css";
import Icon from "../../../utils/Icons";
import { getRelativeDueDate } from "@/features/shared/libs/relativeDueDate";
import { useSelector, useDispatch } from "react-redux";
import todoService from "../../../services/TodoServices";
import { toogleTodoCompleted, updateTodo, deleteTodo } from "../../../store/Features/TodoSlice";
import TodoDatePicker from "../../../features/shared/components/DatePicker/DatePicker";
import TodoAddTask from "../TodoAddTask/TodoAddTask";
import { setEditingTaskId } from "../../../store/Features/TodoSlice";
import { TaskCard, TaskCheckbox as TodoCheckBox } from "@/features/tasks/components";

const TodoEditTask = ({ id }) => {
    const dispatch = useDispatch();
    const todo = useSelector((state) => state.TodoData.Todos[id]);

    const [dueDate, setDueDate] = useState(todo.dueDate);
    const [expandedDatePicker, setExpandedDatePicker] = useState(false);
    const [dateIconColor, setDateIconColor] = useState("var(--Disabled)");
    const datePickerRef = useRef(null);

    const [priority, setPriority] = useState(todo.priority);
    const [prioritySelectorExpanded, setPrioritySelectorExpanded] = useState(false);
    const prioritySelectorRef = useRef(null);

    const [taskValue, setTaskValue] = useState(todo.task);
    const [descriptionValue, setDescriptionValue] = useState(todo.description);
    const taskRef = useRef(null);
    const descriptionRef = useRef(null);

    const [editingTask, setEditingTask] = useState(false);

    const parentTaskCompleted = useSelector(
        (state) => state.TodoData?.Todos[todo?.parentTaskId]?.completed,
    );

    const [expandedSubTasks, setExpandedSubTasks] = useState(false);
    const [expandedCompletedSubTasks, setExpandedCompletedSubTasks] = useState(false);

    let subTasksRemaining = [];
    let subTasksCompleted = [];

    const subTasksState = useSelector((state) =>
        todo.subTasks
            ? Object.entries(todo?.subTasks)
                  .sort((a, b) => a[1] - b[1])
                  .map(([id]) => ({
                      id,
                      completed: state.TodoData.Todos[id]?.completed || false,
                  }))
            : [],
    );

    for (const { id, completed: subTaskCompleted } of subTasksState) {
        const subTaskCard = (
            <div className="TodoTaskCardSubTask" key={id}>
                <TaskCard
                    id={id}
                    parentTaskCompleted={parentTaskCompleted || todo.completed}
                    view={"List"}
                />
            </div>
        );

        if (subTaskCompleted) {
            subTasksCompleted.push(subTaskCard);
        } else {
            subTasksRemaining.push(subTaskCard);
        }
    }

    const subTasksTotal = subTasksCompleted.length + subTasksRemaining.length;

    const toogleCompleted = async () => {
        const { message, success, data } = await todoService.ToggleCompletedTodo(id);

        if (success) {
            dispatch(
                toogleTodoCompleted({
                    todoId: id,
                    completed: !todo.completed,
                }),
            );
        }
    };

    const expandDatePicker = () => {
        if (!todo.completed && !editingTask) {
            setExpandedDatePicker(!expandedDatePicker);
            setPrioritySelectorExpanded(false);
        }
    };

    const expandPrioritySelector = () => {
        if (!todo.completed && !editingTask) {
            setPrioritySelectorExpanded(!prioritySelectorExpanded);
            setExpandedDatePicker(false);
        }
    };

    const closeWindow = () => {
        if (!taskValue && !descriptionValue && subTasksTotal === 0) {
            dispatch(deleteTodo({ todoId: id }));
        }

        dispatch(setEditingTaskId({ todoId: null }));
        setExpandedDatePicker(false);
        setPrioritySelectorExpanded(false);
    };

    const saveTaskData = (data) => {
        dispatch(
            updateTodo({
                todoId: id,
                todo: data,
            }),
        );

        setEditingTask(false);
    };

    const handleOnChange = ({ e, ref }) => {
        const element = ref?.current || e?.currentTarget;

        if (!element) return;

        element.style.height = "auto"; // reset to shrink if needed
        element.style.height = `${element.scrollHeight}px`; // set to fit

        if (element === taskRef.current) setTaskValue(element.value);
        else if (element === descriptionRef.current) setDescriptionValue(element.value);
    };

    const moveToParent = (id) => {
        dispatch(setEditingTaskId({ todoId: id }));
    };

    let todoPath = [];

    console.log(todo);

    let rootParentSectionId = todo.sectionId;
    useSelector((state) => {
        for (let pid = todo.parentTodoId; pid; ) {
            const parentTodo = state.TodoData.Todos[pid];

            todoPath.push(
                <button
                    key={pid}
                    className="TodoEditTaskPathButton"
                    id={pid}
                    type="button"
                    onClick={(e) => moveToParent(e.currentTarget.id)}
                >
                    <span>{parentTodo.task}</span>
                </button>,
            );
            todoPath.push(<span key={pid + ">"}> {">"} </span>);

            pid = parentTodo?.parentTodoId;
            if (!pid) {
                rootParentSectionId = parentTodo.sectionId;
                break;
            }
        }
    });

    let [rootParentTag, rootParentTagColor] = useSelector((state) => [
        state.TodoData.Tags[state.TodoData.Sections[rootParentSectionId]?.tagId]?.title,
        state.TodoData.Tags[state.TodoData.Sections[rootParentSectionId]?.tagId]?.tagColor,
    ]);

    rootParentTagColor = rootParentTagColor === "default" ? "var(--Disabled)" : rootParentTagColor;

    const rootParentSectionName = useSelector(
        (state) => state.TodoData.Sections[rootParentSectionId]?.sectionName,
    );

    todoPath.reverse();

    useEffect(() => {
        if (editingTask) {
            taskRef.current.focus();
        }
    }, [editingTask]);

    useEffect(() => {
        handleOnChange({ ref: taskRef });
        handleOnChange({ ref: descriptionRef });

        setTaskValue(todo.task);
        setDescriptionValue(todo.description);
        setDueDate(todo.dueDate);
        setPriority(todo.priority);
    }, [todo]);

    useEffect(() => {
        setDateIconColor(getRelativeDueDate(dueDate)[1]);
        saveTaskData({ dueDate: dueDate?.toString() });
    }, [dueDate]);

    useEffect(() => {
        saveTaskData({ priority });
    }, [priority]);

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
        <div className="TodoEditTaskBckground">
            <div
                className={`TodoEditTaskContainer ${
                    parentTaskCompleted || todo.completed ? "Checked" : ""
                } ${editingTask ? "Editing" : ""}`}
            >
                <button type="button" className="TodoEditTaskCloseButton" onClick={closeWindow}>
                    <Icon name={"IconCross"} size="XS" />
                </button>

                <div className="TodoEditTaskHeader">
                    <button
                        type="button"
                        className="TodoEditTaskTagButton"
                        style={{ "--tagColor": rootParentTagColor }}
                    >
                        <Icon name={"IconTag"} size="XS" />
                        <span>{rootParentTag}</span>
                        /
                        <Icon name={"IconAddSection"} size="XS" />
                        <span>{rootParentSectionName}</span>
                    </button>

                    <div className="TodoEditTaskPathContainer">{todoPath}</div>
                </div>

                <div className="TodoEditTaskMain">
                    <div className="TodoEditTaskData">
                        <TodoCheckBox
                            priority={priority}
                            checked={parentTaskCompleted || todo.completed}
                            setChecked={toogleCompleted}
                            disabled={editingTask}
                        />
                        <div
                            className="TodoEditTaskContent"
                            onFocus={() => {
                                if (!todo.completed) setEditingTask(true);
                            }}
                        >
                            <textarea
                                className="TodoEditTaskTitle"
                                rows={1}
                                placeholder="Task..."
                                ref={taskRef}
                                onChange={(e) => handleOnChange({ e })}
                                readOnly={!editingTask}
                                value={taskValue}
                            />
                            <textarea
                                className="TodoEditTaskDescription"
                                rows={1}
                                placeholder="Description..."
                                ref={descriptionRef}
                                onChange={(e) => handleOnChange({ e })}
                                readOnly={!editingTask}
                                value={descriptionValue}
                            />

                            {editingTask && (
                                <div className="TodoEditTaskContentButtons">
                                    <button
                                        type="button"
                                        className="TodoEditTaskCancelButton"
                                        onClick={() => setEditingTask(false)}
                                    >
                                        <Icon name="IconPlusFilled" size="S" />
                                        <p>Cancel</p>
                                    </button>

                                    <button
                                        type="button"
                                        className="TodoEditTaskSaveButton"
                                        onClick={() =>
                                            saveTaskData({
                                                task: taskValue,
                                                description: descriptionValue,
                                            })
                                        }
                                    >
                                        <Icon name="IconTickFilled" size="S" />
                                        <p>Save</p>
                                    </button>
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            className="TodoEditTaskPriorityButton"
                            onClick={expandPrioritySelector}
                            id={`P${priority}Flag`}
                        >
                            <Icon name="IconFlag" size="S" />
                        </button>

                        {prioritySelectorExpanded && (
                            <div
                                className="TodoEditTaskPrioritySelectorContainer"
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

                        <button
                            type="button"
                            className="TodoEditTaskDateButton"
                            onClick={expandDatePicker}
                            style={{ "--color": dateIconColor }}
                        >
                            <Icon name="IconCalendar2" size="S" />
                            <p>{getRelativeDueDate(dueDate)[0]}</p>
                        </button>
                        {expandedDatePicker && (
                            <div className="TodoEditTaskDatePicker" ref={datePickerRef}>
                                <TodoDatePicker dueDate={dueDate} setDateValue={setDueDate} />
                            </div>
                        )}
                    </div>

                    {(!todo.isSubTask || (todo.isSubTask && todo.subTaskDepth < 4)) && (
                        <div
                            className={`TodoEditTaskSubTasksContainer ${
                                expandedSubTasks ? "Expanded" : ""
                            }`}
                        >
                            <div className="TodoEditTaskSubTasksHeading">
                                <button
                                    className="TodoEditTaskSubTasksVIcon"
                                    type="button"
                                    onClick={() => setExpandedSubTasks(!expandedSubTasks)}
                                >
                                    <Icon name="IconV" size="XS" />
                                </button>
                                Subtasks{" "}
                                <sup>
                                    {subTasksRemaining.length}/ {subTasksTotal}
                                </sup>
                            </div>

                            <div className="TodoEditTaskSubTasksContent">
                                <div className="TodoEditTaskSubTasksRemainingTodos">
                                    {subTasksRemaining.length > 0 && subTasksRemaining}

                                    <TodoAddTask
                                        isForSubTask={true}
                                        view="List"
                                        parentTaskId={id}
                                    />
                                </div>

                                <div
                                    className={`TodoEditTaskSubTasksCompleted ${
                                        expandedCompletedSubTasks ? "Expanded" : ""
                                    }`}
                                >
                                    <div className="TodoEditTaskSubTasksHeading">
                                        <button
                                            className="TodoEditTaskSubTasksVIcon"
                                            type="button"
                                            onClick={() =>
                                                setExpandedCompletedSubTasks(
                                                    !expandedCompletedSubTasks,
                                                )
                                            }
                                        >
                                            <Icon name="IconV" size="XS" />
                                        </button>
                                        Completed :
                                    </div>
                                    <div className="TodoEditTaskSubTasksContent">
                                        <div className="TodoEditTaskSubTasksCompletedTodos">
                                            {subTasksCompleted.length > 0 && subTasksCompleted}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TodoEditTask;
