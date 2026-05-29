import styles from "./Tooltip.module.css";
import { cloneElement, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";
import mergeRefs from "@/shared/libs/mergeRefs";

const OFFSET = 8;
const EDGE_PADDING = 8;

export default function Tooltip({ children, trigger = <Info size={16} />, className = "" }) {
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);

    const [open, setOpen] = useState(false);

    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });

    // ===== Auto align itself to edges =====
    useLayoutEffect(() => {
        if (!open) return;

        const triggerEl = triggerRef.current;
        const tooltipEl = tooltipRef.current;

        if (!triggerEl || !tooltipEl) return;

        const triggerRect = triggerEl.getBoundingClientRect();
        const tooltipRect = tooltipEl.getBoundingClientRect();

        let top = triggerRect.top - tooltipRect.height - OFFSET;

        let left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;

        // Horizontal edge adjustment
        left = Math.max(
            EDGE_PADDING,
            Math.min(left, window.innerWidth - tooltipRect.width - EDGE_PADDING),
        );

        // Top overflows -> place below
        if (top < EDGE_PADDING) top = triggerRect.bottom + OFFSET;

        // Bottom overflow -> move up to fit edge padding
        if (top + tooltipRect.height > window.innerHeight - EDGE_PADDING)
            top = window.innerHeight - tooltipRect.height - EDGE_PADDING;

        setPosition({ top, left });
    }, [open]);

    return (
        <>
            {cloneElement(trigger, {
                ref: mergeRefs(trigger.ref, triggerRef),
                onMouseEnter: (e) => {
                    trigger.props.onMouseEnter?.(e);
                    setOpen(true);
                },

                onMouseLeave: (e) => {
                    trigger.props.onMouseLeave?.(e);
                    setOpen(false);
                },

                onFocus: (e) => {
                    trigger.props.onFocus?.(e);
                    setOpen(true);
                },

                onBlur: (e) => {
                    trigger.props.onBlur?.(e);
                    setOpen(false);
                },
            })}

            {open &&
                createPortal(
                    <div
                        ref={tooltipRef}
                        role="tooltip"
                        style={position}
                        className={`${styles.tooltip} ${className}`}
                    >
                        {children}
                    </div>,
                    document.body,
                )}
        </>
    );
}
