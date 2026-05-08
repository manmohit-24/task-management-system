import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./Dropdown.module.css";

export default function Dropdown({
    open,
    onOpenChange,
    trigger,
    children,
    disabled = false,
    fixedAlign,
    className = { trigger: "", menu: "" },
}) {
    const [align, setAlign] = useState(fixedAlign ?? "center");

    const triggerRef = useRef(null);
    const menuRef = useRef(null);

    function isInsideDropdown(node) {
        if (!node) return false;

        return !!(menuRef.current?.contains(node) || triggerRef.current?.contains(node));
    }

    // Disabled + auto alignment
    useLayoutEffect(() => {
        if (!open) return;

        if (disabled) {
            onOpenChange(false);
            return;
        }

        if (fixedAlign) {
            setAlign(fixedAlign);
            return;
        }

        const trigger = triggerRef.current;
        const menu = menuRef.current;

        if (!trigger || !menu) return;

        const EDGE_PADDING = 30;

        const triggerRect = trigger.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();

        const spaceLeft = triggerRect.left;
        const spaceRight = window.innerWidth - triggerRect.right;

        if (spaceRight < menuRect.width + EDGE_PADDING) setAlign("right");
        else if (spaceLeft < menuRect.width + EDGE_PADDING) setAlign("left");
        else setAlign("center");
    }, [open, disabled, fixedAlign, onOpenChange]);

    // Outside click + Escape
    useEffect(() => {
        if (!open) return;

        function onPointerDown(e) {
            if (!isInsideDropdown(e.target)) onOpenChange(false);
        }

        function onKeyDown(e) {
            if (e.key === "Escape") onOpenChange(false);
        }

        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open, onOpenChange]);

    // Focus lifecycle
    const prevOpenRef = useRef(null);

    useEffect(() => {
        if (open) menuRef.current?.focus();

        if (prevOpenRef.current === true && !open) triggerRef.current?.focus();

        prevOpenRef.current = open;
    }, [open]);

    return (
        <div className={styles.dropdown}>
            <button
                ref={triggerRef}
                type="button"
                disabled={disabled}
                onClick={() => onOpenChange(!open)}
                aria-haspopup="menu"
                aria-expanded={open}
                className={`${styles.trigger} ${className.trigger}`}
            >
                {trigger}
            </button>

            {!disabled && open && (
                <div
                    ref={menuRef}
                    role="menu"
                    tabIndex={-1}
                    className={`${styles.menu} ${styles[align]} ${className.menu}`}
                >
                    {children}
                </div>
            )}
        </div>
    );
}
