import styles from "./DatePickerMenu.module.css";
import { useEffect, useMemo, useRef, useState } from "react";

import { Dropdown, DatePicker } from "@/shared/components";
import { getRelativeDueDate } from "@/shared/libs/relativeDueDate";
import { CalendarDays } from "@/shared/icons";

export default function DatePickerMenu({
    value,
    onChange,
    disabled = false,
    debounceMs = 1200,
    triggerClassName = "",
    dropdownClassName = "",
    iconOnly = false,
}) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open == false) isFirstRender.current = true;
    }, [open]);

    // ===== Local Date =====
    // Date Chnages will be first updated local
    // and then revoke the callback after debounce

    const [localDate, setLocalDate] = useState(value);
    const isFirstRender = useRef(true);

    // ===== Debounced Date Chnage Call =====
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Avoid timeout overhead is debounce is 0
        // deboundeMs = 0 can be used in forms where instant onChange is ideal than debounced
        if (debounceMs === 0) {
            onChange?.(localDate);
            return;
        }

        // debounced update is ideal where onChange directly makes and backend update call
        const timeout = setTimeout(() => {
            onChange?.(localDate);
        }, debounceMs);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line
    }, [localDate, debounceMs]);

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
                menu: ` ${styles.dropdown} ${dropdownClassName}`,
            }}
            /*===== Trigger =====*/
            trigger={
                <div
                    disabled={disabled}
                    className={`
                        ${styles.trigger} ${open ? styles.active : ""}
                        ${triggerClassName}
                    `}
                    style={{ "--date-color": relativeDueDate.color }}
                >
                    <CalendarDays size={16} />
                    {!iconOnly && <span>{relativeDueDate.label}</span>}
                </div>
            }
        >
            {/*===== Menu =====*/}
            <DatePicker date={localDate} onDateChange={setLocalDate} />
        </Dropdown>
    );
}
