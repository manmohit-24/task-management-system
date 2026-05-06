import "./SideBarLabel.css";
import Icon from "@/utils/Icons";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setConfirmDelete } from "@/store/Features/GeneralSlice";
import { deleteTag } from "@/store/Features/TodoSlice";
import { useNavigate } from "react-router-dom";
import { updateTag } from "@/store/Features/TodoSlice";

const SideBarLabel = ({
    title = "SideBarLabel",
    icon = "",
    number = "10",
    id,
    selected = false,
    onClick = () => {},
    color = "var(--Disabled)",
    isList = false,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    color = color === "default" ? "var(--Disabled)" : color;
    const hoverColor = !isList && color === "var(--Disabled)" ? "var(--Accent-Color)" : color;

    const expnadedOptionsRef = useRef(null);
    const [expandedOptions, setExpandedOptions] = useState(false);
    const [isEditting, setIsEditting] = useState(false);

    const [newListName, setNewListName] = useState(title);
    const [newListColor, setNewListColor] = useState(color);

    let className = `SideBarLabelContainer ${selected ? "SideBarLabelSelected" : " "}`;

    const askDeleteConfirmation = (e) => {
        e.stopPropagation();

        dispatch(
            setConfirmDelete({
                show: true,
                title: `Are you sure you want to delete Project <br/>
                        <span style= "font-weight : bold;"> ${title}</span> ?`,
                targetId: id,
                target: "tag",
            }),
        );
    };

    const editList = () => {
        if (newListName) {
            dispatch(updateTag({ tagId: id, tag: { title: newListName, tagColor: newListColor } }));
        }
        setIsEditting(false);
        setExpandedOptions(false);
    };

    useEffect(() => {
        if (isList) {
            setExpandedOptions(false);
        }
    }, [isList]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (expnadedOptionsRef.current && !expnadedOptionsRef.current.contains(e.target)) {
                if (newListName.trim() === title && newListColor === color) {
                    setExpandedOptions(false);
                    setIsEditting(false);
                    setNewListColor(color);
                    setNewListName(title);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [newListName, newListColor, isEditting]);

    return (
        <div
            onClick={onClick}
            className={className}
            id={id}
            style={{ "--color": newListColor, "--hover-color": hoverColor }}
        >
            {icon}
            <span className={`SideBarLabelTitle`}>{title}</span>

            <div className="SideBarLabelRight">
                {number && (
                    <span className={`SideBarLabelNumber ${isList ? "isList" : ""}`}>{number}</span>
                )}
                {isList && (
                    <button
                        className="SideBarLabelMore"
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpandedOptions(!expandedOptions);
                        }}
                    >
                        <Icon name={"IconDots3"} size="S" />
                    </button>
                )}
            </div>

            {isList && expandedOptions && (
                <div className="SideBarLabelMoreOptions" ref={expnadedOptionsRef}>
                    {isEditting ? (
                        <div
                            className="SideBarLabelEditListContainer"
                            onKeyDownCapture={(e) => {
                                if (e.key === "Enter") editList();
                            }}
                        >
                            <div className="SideBarLabelEditListTag">
                                <Icon name={"IconTagFilled"} size={"M"} />
                                <input
                                    type="color"
                                    value={newListColor}
                                    onChange={(e) => setNewListColor(e.target.value)}
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="New List"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                            />
                            <div className="SideBarLabelEditListButtons">
                                <button
                                    className="SideBarLabelEditListCancelButton"
                                    onClick={() => setIsEditting(false)}
                                >
                                    <Icon name={"IconPlusFilled"} size={"S"} />
                                    Cancel{" "}
                                </button>

                                <button
                                    className="SideBarLabelEditListSaveButton"
                                    onClick={editList}
                                >
                                    <Icon name={"IconTickFilled"} size={"S"} />
                                    Save{" "}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <button
                                className="SideBarLabelEdit"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditting(true);
                                }}
                            >
                                <Icon name={"IconEdit"} size="M" />
                                Edit
                            </button>

                            <button
                                className="SideBarLabelMove"
                                // onClick={(e) => askDeleteConfirmation(e)}
                            >
                                <Icon name={"IconTagMove"} size="M" />
                                Move
                            </button>

                            <button
                                className="SideBarLabelDelete"
                                onClick={(e) => askDeleteConfirmation(e)}
                            >
                                <Icon name={"IconBin"} size="M" />
                                Delete
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SideBarLabel;
