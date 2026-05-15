import "./TodoSection.css";
import Icon from "../../../utils/Icons";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import TodoTaskCard from "../TodoTaskCard/TodoTaskCard";
import TodoAddTask from "../TodoAddTask/TodoAddTask";
import { updateSection, deleteSection } from "../../../store/Features/TodoSlice";
import { setConfirmDelete } from "../../../store/Features/GeneralSlice";
import TodoAddSection from "../TodoAddSection/TodoAddSection";

const TodoSection = ({ sectionId }) => {
    const dispatch = useDispatch();
    const view = useSelector((state) => state.TodoData.View);

    const { sectionName, tagId, todos, number } = {
        sectionName: sectionId,
    };

    const isEditable = !(
        tagId === "upcoming" ||
        tagId === "today" ||
        sectionId.split("-")[0] === "Completed" ||
        sectionId.split("-")[0] == "NotSectioned"
    );

    const [collapsedTask, setCollapsedTasks] = useState(false);

    const expnadedOptionsRef = useRef(null);
    const [expandedOptions, setExpandedOptions] = useState(false);
    const [isEditting, setIsEditting] = useState(false);

    const [newSectionName, setNewSectionName] = useState(sectionName);

    const containerClass = `TodoSectionContainer ${view}View ${collapsedTask ? "Collapsed" : ""}`;

    const todosComponents = useSelector((state) => {
        return todos
            ? Object.entries(todos)
                  .filter(
                      ([todoId]) =>
                          (sectionName === "Completed" &&
                              state.TodoData.Todos[todoId]?.completed) ||
                          (sectionName !== "Completed" && !state.TodoData.Todos[todoId]?.completed),
                  )
                  .sort((a, b) => a[1] - b[1])
                  .map(([todoId]) => <TodoTaskCard key={todoId} id={todoId} />)
            : [];
    });

    useEffect(() => {
        if (number && number !== todosComponents.length) {
            dispatch(
                updateSection({
                    sectionId,
                    section: { number: todosComponents.length },
                }),
            );
        }
    }, [todosComponents]);

    const editSection = () => {
        dispatch(
            updateSection({
                sectionId,
                section: { sectionName: newSectionName },
            }),
        );
        setIsEditting(false);
        setExpandedOptions(false);
    };

    const handleDeleteSection = () => {
        dispatch(
            setConfirmDelete({
                show: true,
                title: `Are you sure you want to delete Section <br/>
                        <span style= "font-weight : bold;"> ${sectionName}</span> ?`,
                targetId: sectionId,
                target: "section",
            }),
        );
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (expnadedOptionsRef.current && !expnadedOptionsRef.current.contains(e.target)) {
                if (newSectionName.trim() === sectionName) {
                    setExpandedOptions(false);
                    setIsEditting(false);
                    setNewSectionName(sectionName);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [newSectionName, isEditting]);

    if (todosComponents.length === 0 && (sectionName === "Completed" || sectionName === "Overdue"))
        return <></>;

    return (
        <section className={containerClass}>
            {/*------------------ Section Heading ------------------ */}
            {!(view === "List" && sectionName === "Not Sectioned") && (
                <div className="TodoSectionHeadingContainer">
                    <div className="TodoSectionHeadingLeftIcons">
                        <button className="TodoSectionHeadingDragIcon">
                            <Icon name={"IconDrag"} size="XS" />
                        </button>

                        <button
                            className="TodoSectionHeadingVIcon"
                            onClick={() => setCollapsedTasks(!collapsedTask)}
                        >
                            <Icon name={"IconV"} size="XS" />
                        </button>
                    </div>

                    {!isEditting ? (
                        <div className="TodoSectionHeadingContent">
                            <h2>{sectionName}</h2>
                            <p>{todosComponents.length}</p>
                        </div>
                    ) : (
                        <div className="TodoSectionHeadingEditForm">
                            <input
                                type="text"
                                value={newSectionName}
                                onChange={(e) => setNewSectionName(e.target.value)}
                            />

                            <button
                                className="TodoSectionHeadingEditFormCancelButton"
                                onClick={() => setIsEditting(false)}
                            >
                                <Icon name={"IconPlusFilled"} size={"S"} />
                                Cancel{" "}
                            </button>

                            <button
                                className="TodoSectionHeadingEditFormSaveButton"
                                onClick={editSection}
                            >
                                <Icon name={"IconTickFilled"} size={"S"} />
                                Save{" "}
                            </button>
                        </div>
                    )}

                    {!isEditting && isEditable && (
                        <div className="TodoSectionHeadingRightIcons">
                            <button
                                className={`TodoSectionHeadingMoreIcon ${
                                    expandedOptions ? "Active" : ""
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedOptions(!expandedOptions);
                                }}
                            >
                                <Icon name={"IconDots3"} size="XS" />
                            </button>
                        </div>
                    )}

                    {expandedOptions && !isEditting && (
                        <div className="TodoSectionMoreOptions" ref={expnadedOptionsRef}>
                            <button
                                className="TodoSectionMoreEdit"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditting(true);
                                }}
                            >
                                <Icon name={"IconEdit"} size="S" />
                                Edit
                            </button>
                            <button
                                className="TodoSectionMoreMove"
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <Icon name={"IconTagMove"} size="S" />
                                Move
                            </button>
                            <button
                                className="TodoSectionMoreDuplicate"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Icon name={"IconClone"} size="S" />
                                Duplicate
                            </button>
                            <button
                                className="TodoSectionMoreDelete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSection();
                                }}
                            >
                                <Icon name={"IconBin"} size="S" />
                                Delete
                            </button>
                        </div>
                    )}

                    <div className="TodoSectionHeadingBorder" />
                </div>
            )}

            {/*------------------ Section Todos ------------------ */}
            <div className="TodoSectionContent">
                <div className="TodoSectionTodos">{todosComponents}</div>

                {sectionName !== "Completed" && sectionName !== "Overdue" && (
                    <div className="TodoSectionAddTask">
                        <TodoAddTask sectionId={sectionId} />
                    </div>
                )}
            </div>
        </section>
    );
};

export default TodoSection;
