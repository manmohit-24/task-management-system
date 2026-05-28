import { useEffect, useRef } from "react";

export default function InlineEditor({
    open,
    onOpenChange,
    closeOnOutsideClick = true,
    closeOnEscape = true,
    children,
}) {
    const containerRef = useRef(null);

    // outside click
    useEffect(() => {
        if (!open || !closeOnOutsideClick) return;

        function handlePointerDown(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                onOpenChange(false);
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [open, closeOnOutsideClick, onOpenChange]);

    // escape
    useEffect(() => {
        if (!open || !closeOnEscape) return;

        function handleKeyDown(e) {
            if (e.key === "Escape") {
                onOpenChange(false);
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, closeOnEscape, onOpenChange]);

    if (!open) return null;

    return <div ref={containerRef}>{children}</div>;
}
