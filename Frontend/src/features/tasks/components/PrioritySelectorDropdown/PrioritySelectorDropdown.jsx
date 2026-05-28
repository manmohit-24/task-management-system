import styles from "./PrioritySelectorDropdown.module.css";
import { useEffect, useRef, useState } from "react";
import { Dropdown } from "@/features/shared/components";
import { FlagTriangleRight } from "lucide-react";

export default function PrioritySelectorDropdown({
    value,
    onChange,
    disabled = false,
    debounceMs = 1200,
    triggerClassName = "",
    dropdownClassName = "",
}) {
    const [open, setOpen] = useState(false);
    const [localPriority, setLocalPriority] = useState(value);
    const isFirstRender = useRef(true);

    useEffect(() => {
        setLocalPriority(value);
    }, [value]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            onChange?.(localPriority);
        }, debounceMs);

        return () => clearTimeout(timeout);
    }, [localPriority, debounceMs, onChange]);

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
                        ${styles[`p${localPriority}`]}
                        ${triggerClassName}
                    `}
                >
                    <FlagTriangleRight size={16} />
                </div>
            }
        >
            <div className={styles.menu}>
                {[1, 2, 3, 4].map((p) => (
                    <button
                        key={p}
                        className={`${styles.button} ${styles[`p${p}`]}`}
                        type="button"
                        onClick={() => setLocalPriority(p)}
                    >
                        <FlagTriangleRight size={16} />
                        <span>P{p}</span>
                    </button>
                ))}
            </div>
        </Dropdown>
    );
}
