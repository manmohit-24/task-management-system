import styles from "./PrioritySelectorMenu.module.css";
import { useEffect, useRef, useState } from "react";

import { Dropdown } from "@/shared/components";
import { FlagTriangleRight } from "lucide-react";

export default function PrioritySelectorMenu({
    value,
    onChange,
    disabled = false,
    debounceMs = 1200,
    triggerClassName = "",
    dropdownClassName = "",
}) {
    const [open, setOpen] = useState(false);

    // ===== Local Priority =====
    // Priority Chnages will be first updated local
    // and then revoke the callback after debounce

    const [localPriority, setLocalPriority] = useState(value);
    const isFirstRender = useRef(true);

    useEffect(() => {
        setLocalPriority(value);
    }, [value]);

    // ===== Debounced Priority Chnage Call =====
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Avoid timeout overhead is debounce is 0
        // deboundeMs = 0 can be used in forms where instant onChange is ideal than debounced
        if (debounceMs === 0) {
            onChange?.(localPriority);
            return;
        }

        // debounced update is ideal where onChange directly makes and backend update call
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
            disabled={disabled}
            className={{
                trigger: styles.dropdownTrigger,
                menu: `${styles.dropdown} ${dropdownClassName}`,
            }}
            /*===== Trigger =====*/
            trigger={
                <div
                    className={`
                        ${styles.trigger} ${open ? styles.active : ""}
                        ${styles[`p${localPriority}`]} ${triggerClassName}
                    `}
                >
                    <FlagTriangleRight size={16} />
                </div>
            }
        >
            {/*===== Menu =====*/}
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
