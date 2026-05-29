import Tooltip from "../Tooltip/Tooltip";
import WorkInProgress from "../WorkInProgress/WorkInProgress";
import styles from "./WorkInProgressTooltip.module.css";

export default function WorkInProgressTooltip({ children }) {
    return (
        <Tooltip trigger={children} className={styles.tooltip}>
            <WorkInProgress />
        </Tooltip>
    );
}
