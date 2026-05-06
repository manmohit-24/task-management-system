import "./SideBar.css";
import Icon from "../../../utils/Icons";
import SideBarHeader from "./SideBarHeader/SideBarHeader";
import SideBarLabel from "./SideBarLabel/SideBarLabel";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addTag } from "../../../store/Features/TodoSlice";
const SideBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { pageType, tagId } = useParams();

    const [isSideBarExpanded, setIsSideBarExpanded] = useState(true);
    const [isCustomListsExpanded, setIsCustomListsExpanded] = useState(true);

    const [isAddingNewList, setIsAddingNewList] = useState(false);

    const disAbledColor = useSelector((state) => state.GeneralData.ThemeColors.Disabled);
    const [newListName, setNewListName] = useState("");
    const [newListColor, setNewListColor] = useState(disAbledColor);
    const newListRef = useRef(null);

    const Tags = pageType === "notes" ? {} : useSelector((state) => state.TodoData.Tags);

    const handleClick = (labelId) =>
        navigate(pageType === "notes" ? `app/notes/${labelId}` : `/app/todo/${labelId}`);

    const numberOfTodayTasks = useSelector((state) => state.TodoData.NumberOfTodayTasks);
    const sections = useSelector((state) => state.TodoData.Sections);

    const getNumberOfTasks = (tagId) => {
        let count = 0;

        Object.keys(Tags[tagId]?.sections || {}).forEach((sectionId) => {
            if (sectionId.split("-")[0] !== "Completed") count += sections[sectionId]?.number || 0;
        });

        return count === 0 ? "" : count;
    };

    const SideBarDefaultLabels = (
        pageType === "notes"
            ? []
            : [
                  {
                      title: "Today",
                      icon: "IconCalendarToday",
                      id: "today",
                      number: getNumberOfTasks("today") || "",
                  }, // Later we will retrieve id from backend , id will help to organise tasks easily among labels
                  {
                      title: "Inbox",
                      icon: "IconInbox",
                      id: "inbox",
                      number: getNumberOfTasks("inbox") || "",
                  },
                  { title: "Upcoming", icon: "IconCalendar1", id: "upcoming" },
              ]
    )?.map((item) => (
        <SideBarLabel
            title={item.title}
            icon={<Icon name={item.icon} size={"M"} />}
            id={item.id}
            number={item.number || ""}
            key={item.id}
            selected={item.id === tagId}
            onClick={() => handleClick(item.id)}
            tagColor="var(--Disabled)"
        />
    ));

    useEffect(() => {
        if (isAddingNewList) {
            setNewListColor(disAbledColor);
            setNewListName("");
            document.querySelector(".SideBarCustomListsAddListContainer > input")?.focus();
        }
    }, [isAddingNewList]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (newListRef.current && !newListRef.current.contains(e.target)) {
                if (!newListName && !newListColor) setIsAddingNewList(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [newListName, isAddingNewList, newListColor]);

    const SideBarCustomLists = Object.keys(Tags)?.map(
        (labelId) =>
            labelId !== "inbox" &&
            labelId !== "today" && (
                <SideBarLabel
                    title={Tags[labelId]?.title}
                    icon={<Icon name={"IconTagFilled"} size={"M"} />}
                    id={labelId}
                    number={getNumberOfTasks(labelId)}
                    key={labelId}
                    selected={labelId === tagId}
                    onClick={() => handleClick(labelId)}
                    color={Tags[labelId]?.tagColor}
                    isList={true}
                />
            ),
    );

    let Heading = pageType === "notes" ? "My NoteBooks" : "My Projects";

    const addNewList = () => {
        if (newListName) {
            let tagId = `${newListName.replace(/[^a-zA-Z0-9]/g, "-")}${Date.now()}`;

            if (newListColor === disAbledColor) {
                setNewListColor("default");
            }

            dispatch(addTag({ tagId, tag: { title: newListName, tagColor: newListColor } }));
            setNewListName("");
            setNewListColor(disAbledColor);
        }
        setIsAddingNewList(false);
    };

    return (
        <nav
            className={`SideBarContainer ${
                isSideBarExpanded ? "SideBarExpanded" : "SideBarCollapsed"
            }`}
        >
            {/* --------------------- SideBarHeader --------------------- */}
            <SideBarHeader toogleExpansion={() => setIsSideBarExpanded(!isSideBarExpanded)} />

            {/* --------------------- SideBarDefaultLabels --------------------- */}
            <div className="SideBarDefaultLabels">{SideBarDefaultLabels}</div>

            {/* --------------------- SideBarCustomListsHeading --------------------- */}
            <div className={`SideBarCustomListsHeading ${isAddingNewList ? "AddingList" : ""} `}>
                <button>{Heading}</button>

                <div className="SideBarCustomListsHeadingIcons">
                    <button onClick={() => setIsAddingNewList(!isAddingNewList)}>
                        <Icon name={"IconPlus"} size={"XS"} />
                    </button>

                    <button
                        className={isCustomListsExpanded ? "" : "SideBarCustomListsCollapsed"}
                        onClick={() => setIsCustomListsExpanded(!isCustomListsExpanded)}
                    >
                        <Icon name={"IconV"} size={"XS"} />
                    </button>
                </div>

                {isAddingNewList && (
                    <div
                        className="SideBarCustomListsAddListContainer"
                        style={{ "--selectedColor": newListColor }}
                        ref={newListRef}
                        onKeyDownCapture={(e) => {
                            if (e.key === "Enter") addNewList();
                        }}
                    >
                        <div className="SideBarCustomListsAddListTag">
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

                        <button className="SideBarCustomListsAddButton" onClick={addNewList}>
                            <Icon name={"IconPlusFilled"} size={"S"} />
                            Add Project
                        </button>
                    </div>
                )}
            </div>

            {/* --------------------- SideBarCustomLists --------------------- */}
            <div
                className={`SideBarCustomLists ${
                    isCustomListsExpanded ? "" : "SideBarCustomListsCollapsed"
                }`}
            >
                {SideBarCustomLists}
            </div>
        </nav>
    );
};
export default SideBar;
