import styles from "./DatePickerDropdown.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dropdown, DatePicker } from "@/shared/components";
import { getRelativeDueDate } from "@/shared/libs/relativeDueDate";
import { CalendarDays } from "@/shared/icons";

export default function DatePickerDropdown({
    value,
    onChange,
    disabled = false,
    debounceMs = 1200,
    triggerClassName = "",
    dropdownClassName = "",
    iconOnly = false,
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

    const relativeDueDate = useMemo(() => getRelativeDueDate(localDate), [localDate]);

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
                <div
                    disabled={disabled}
                    className={`
                        ${styles.trigger}
                        ${open ? styles.active : ""}
                        ${disabled ? styles.disabled : ""}
                        ${triggerClassName}
                    `}
                    style={{
                        "--date-color": relativeDueDate.color,
                    }}
                >
                    <CalendarDays size={16} />
                    {!iconOnly && <span>{relativeDueDate.label}</span>}
                </div>
            }
        >
            <DatePicker dueDate={localDate} setDateValue={setLocalDate} />
        </Dropdown>
    );
}
