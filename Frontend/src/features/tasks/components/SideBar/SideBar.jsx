import styles from "./SideBar.module.css";
import Icon from "@/utils/Icons";
import { SideBarHeader, SideBarLabel, AddProjectDropDown } from "../";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function SideBar() {
    const navigate = useNavigate();

    const { tagId } = useParams();

    const [isSideBarExpanded, setIsSideBarExpanded] = useState(true);
    const [isCustomListsExpanded, setIsCustomListsExpanded] = useState(true);

    const Tags = useSelector((state) => state.TodoData.Tags);

    const handleClick = (labelId) => navigate(`/app/todo/${labelId}`);

    const sections = useSelector((state) => state.TodoData.Sections);

    const getNumberOfTasks = (tagId) => {
        let count = 0;

        Object.keys(Tags[tagId]?.sections || {}).forEach((sectionId) => {
            if (sectionId.split("-")[0] !== "Completed") count += sections[sectionId]?.number || 0;
        });

        return count === 0 ? "" : count;
    };

    const SideBarDefaultLabels = [
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
    ].map((item) => (
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

    return (
        <nav
            className={`${styles.container} ${styles[isSideBarExpanded ? "expanded" : "collapsed"]}`}
        >
            {/* --------------------- SideBarHeader --------------------- */}
            <SideBarHeader toogleExpansion={() => setIsSideBarExpanded(!isSideBarExpanded)} />

            {/* --------------------- SideBarDefaultLabels --------------------- */}
            <div className={styles.list}>{SideBarDefaultLabels}</div>

            {/* --------------------- SideBarCustomListsHeading --------------------- */}
            <div className={styles.heading}>
                <div>Workspaces</div>

                <div className={styles.headingButtons}>
                    <AddProjectDropDown className={styles.headingButton} />

                    <button
                        className={styles.headingButton}
                        onClick={() => setIsCustomListsExpanded(!isCustomListsExpanded)}
                    >
                        <ChevronRight
                            size={16}
                            className={`${styles.chervon}  ${isCustomListsExpanded ? styles.open : ""}`}
                        />
                    </button>
                </div>
            </div>

            {/* --------------------- SideBarCustomLists --------------------- */}
            <div
                className={`${styles.list} ${
                    isCustomListsExpanded ? "" : "SideBarCustomListsCollapsed"
                }`}
            >
                {SideBarCustomLists}
            </div>
        </nav>
    );
}
