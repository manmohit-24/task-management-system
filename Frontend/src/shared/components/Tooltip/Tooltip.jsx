import styles from "./Tooltip.module.css";

import { cloneElement, useState } from "react";
import { createPortal } from "react-dom";

import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useHover,
    useFocus,
    useRole,
    useInteractions,
} from "@floating-ui/react";

import { Info } from "lucide-react";
import mergeRefs from "@/shared/libs/mergeRefs";

export default function Tooltip({ children, trigger = <Info size={16} />, className = "" }) {
    const [open, setOpen] = useState(false);

    // ===== Floating UI =====
    const { refs, floatingStyles, context } = useFloating({
        open,
        onOpenChange: setOpen,
        placement: "top", // Prefer above trigger
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(8), // Gap between trigger and tooltip
            flip(), // Flip below if not enough room above
            shift({ padding: 8 }), // Keep inside viewport
        ],
    });

    // ===== Interactions =====
    const hover = useHover(context);
    const focus = useFocus(context);

    const role = useRole(context, {
        role: "tooltip",
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, role]);

    return (
        <>
            {cloneElement(trigger, {
                ref: mergeRefs(trigger.ref, refs.setReference),

                ...getReferenceProps(),
            })}

            {open &&
                createPortal(
                    <div
                        ref={refs.setFloating}
                        style={{
                            ...floatingStyles,
                            opacity: refs.floating.current ? 1 : 0, // fix: flash at 0,0
                        }}
                        className={`${styles.tooltip} ${className}`}
                        {...getFloatingProps()}
                    >
                        {children}
                    </div>,
                    document.body,
                )}
        </>
    );
}
