import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
    const triggerRef = useRef(null);
    const menuRef = useRef(null);

    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });

    function isInsideDropdown(node) {
        if (!node) return false;
        return !!(menuRef.current?.contains(node) || triggerRef.current?.contains(node));
    }

    // Positioning
    useLayoutEffect(() => {
        if (!open || disabled) return;
        const triggerEl = triggerRef.current;
        const menuEl = menuRef.current;

        if (!triggerEl || !menuEl) return;

        const EDGE_PADDING = 16;

        const triggerRect = triggerEl.getBoundingClientRect();
        const menuRect = menuEl.getBoundingClientRect();

        let left = triggerRect.left;
        const top = triggerRect.bottom + 8;

        // Alignment logic
        if (fixedAlign === "center") {
            left = triggerRect.left + triggerRect.width / 2 - menuRect.width / 2;
        }

        if (fixedAlign === "right") {
            left = triggerRect.right - menuRect.width;
        }

        // Auto collision handling
        if (!fixedAlign) {
            const overflowRight = left + menuRect.width > window.innerWidth - EDGE_PADDING;
            const overflowLeft = left < EDGE_PADDING;

            if (overflowRight) left = triggerRect.right - menuRect.width;
            if (overflowLeft) left = EDGE_PADDING;
        }

        setPosition({ top, left });
    }, [open, disabled, fixedAlign]);

    // Close on outside click + Escape + Scroll
    useEffect(() => {
        if (!open) return;

        const onPointerDown = (e) => {
            if (!isInsideDropdown(e.target)) onOpenChange(false);
        };

        const onKeyDown = (e) => {
            if (e.key === "Escape") onOpenChange(false);
        };

        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);

        const onScroll = () => onOpenChange(false);

        window.addEventListener("scroll", onScroll, true);

        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("scroll", onScroll, true);
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
        <>
            <button
                ref={triggerRef}
                type="button"
                disabled={disabled}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={(e) => {
                    e.stopPropagation();
                    if (disabled) return;
                    onOpenChange(!open);
                }}
                className={`${styles.trigger} ${className.trigger}`}
            >
                {trigger}
            </button>

            {!disabled &&
                open &&
                createPortal(
                    <div
                        ref={menuRef}
                        role="menu"
                        tabIndex={-1}
                        style={{
                            top: position.top,
                            left: position.left,
                        }}
                        className={`${styles.menu} ${className.menu}`}
                    >
                        {children}
                    </div>,
                    document.body,
                )}
        </>
    );
}
