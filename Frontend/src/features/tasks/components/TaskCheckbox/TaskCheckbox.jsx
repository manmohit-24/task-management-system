import styles from "./TaskCheckbox.module.css";
import { Tick } from "@/shared/icons";

export default function TaskCheckbox({
    priority = 4,
    checked,
    onCheckChange,
    disabled = false,
    ...props
}) {
    return (
        <button
            className={`
              ${styles.container}
              ${checked ? styles.checked : ""}
              ${styles[`p${priority}`]}
              ${disabled ? "Disabled" : ""}
            `}
            onClick={(e) => {
                e.stopPropagation();
                if (disabled) return;
                onCheckChange?.(!checked);
            }}
            disabled={disabled}
            {...props}
        >
            <Tick size={11} className={styles.tick} />
        </button>
    );
}
