import styles from "./DatePickerDropdown.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Dropdown } from "@/features/shared/components";
import { TodoDatePicker } from "@/components";
import { getPrettyDate } from "@/utils/prettyDate";

export default function DatePickerDropdown({
    value,
    onChange,
    disabled = false,
    debounceMs = 1200,
    triggerClassName = "",
    dropdownClassName = "",
}) {
    const [open, setOpen] = useState(false);
    const [localDate, setLocalDate] = useState(value);
    const isFirstRender = useRef(true);

    useEffect(() => {
        setLocalDate(value);
    }, [value]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            onChange?.(localDate);
        }, debounceMs);

        return () => clearTimeout(timeout);
    }, [localDate, debounceMs, onChange]);

    const [prettyDate, dateColor] = useMemo(() => getPrettyDate(localDate), [localDate]);

    return (
        <Dropdown
            open={open}
            onOpenChange={(val) => {
                if (disabled) return setOpen(false);
                setOpen(val);
            }}
            className={{
                trigger: styles.dropdownTrigger,
                menu: `
                    ${styles.dropdown}
                    ${dropdownClassName}
                `,
            }}
            trigger={
                <button
                    type="button"
                    className={`
                        ${styles.trigger}
                        ${triggerClassName}
                        ${open ? styles.active : ""}
                    `}
                    style={{
                        "--date-color": dateColor,
                    }}
                >
                    <CalendarDays size={16} />
                    <span>{prettyDate}</span>
                </button>
            }
        >
            <TodoDatePicker dueDate={localDate} setDateValue={setLocalDate} />
        </Dropdown>
    );
}
