import "./SideBarHeader.css";
import Icon from "@/utils/Icons";
import { useState } from "react";
import { useSelector } from "react-redux";

const SideBarHeader = ({ toogleExpansion }) => {
    let name = (useSelector((state) => state.AuthData.Name) || "Name").split(" ")[0]; // only taking first name

    const [isSideBarHeaderExpanded, setIsSideBarHeaderExpanded] = useState(false);

    let className = `SideBarHeaderContainer ${
        isSideBarHeaderExpanded ? "SideBarHeaderExpanded" : ""
    }`;

    return (
        <div className={className}>
            {/* ----------- SideBarHeader Left Section [ Profile Icon + Name ] ----------- */}
            <button
                className="SideBarHeaderLeft"
                onClick={() => setIsSideBarHeaderExpanded(!isSideBarHeaderExpanded)}
            >
                <div className="SideBarHeaderProfileIcon">
                    <Icon name={"IconProfileLight"} size="XL" />
                </div>

                <p className="SideBarHeaderText">{name}</p>

                <div className="SideBarHeaderVIcon">
                    <Icon name={"IconV"} size="XS" />
                </div>
            </button>

            {/* ----------- SideBarHeader Right Section [ Bell Icon + SideBar Icon ] ----------- */}
            <div className="SideBarHeaderRight">
                <button className="SideBarHeaderBellIcon">
                    <Icon name={"IconBell"} size="M" />
                </button>

                <button className="SideBarHeaderSideBarIcon" onClick={toogleExpansion}>
                    <Icon name={"IconSideBar"} size="M" />
                </button>
            </div>
        </div>
    );
};
export default SideBarHeader;
