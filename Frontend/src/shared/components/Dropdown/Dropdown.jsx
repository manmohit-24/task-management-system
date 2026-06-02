import { createPortal } from "react-dom";

import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useClick,
    useDismiss,
    useRole,
    useInteractions,
} from "@floating-ui/react";

import styles from "./Dropdown.module.css";

export default function Dropdown({
    open,
    onOpenChange,
    trigger,
    children,
    disabled = false,
    className = { trigger: "", menu: "" },
}) {
    // ===== Floating UI =====
    const { refs, floatingStyles, context } = useFloating({
        open,
        onOpenChange,
        placement: "bottom-start", // Default placement
        whileElementsMounted: autoUpdate, // Keep position updated automatically on scrolls, resizings and layout-changes
        middleware: [
            offset(8), // Gap between trigger and menu
            flip(), // If not enough space below, automatically move above
            shift({ padding: 16 }), // Prevent viewport overflow
        ],
    });

    // ===== Interactions =====

    // useClick: Trigger click toggles menu
    const click = useClick(context, {
        enabled: !disabled,
    });

    // useDismiss: Outside click + Escape key
    const dismiss = useDismiss(context);

    // useRole: Accessibility role management
    const role = useRole(context, {
        role: "menu",
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

    return (
        <>
            {/* ===== Trigger ===== */}
            <button
                ref={refs.setReference}
                type="button"
                disabled={disabled}
                className={`${styles.trigger} ${className.trigger}`}
                data-open={open} // use it for stylings the trigger using [data-open="true"] .trigger{...}
                {...getReferenceProps()}
            >
                {trigger}
            </button>

            {/* ===== Menu ===== */}
            {!disabled &&
                open &&
                createPortal(
                    <div
                        ref={refs.setFloating}
                        style={{
                            ...floatingStyles,
                            opacity: refs.floating.current ? 1 : 0, // fix: flash at 0,0
                        }}
                        tabIndex={-1}
                        className={`${styles.menu} ${className.menu}`}
                        {...getFloatingProps()}
                    >
                        {children}
                    </div>,
                    document.body,
                )}
        </>
    );
}
