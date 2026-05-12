import { useEffect, useRef } from "react";
import styles from "./Modal.module.css";

export default function Modal({
    open,
    onOpenChange,
    children,
    className = "",
    closeOnBackdrop = true,
    closeOnEscape = true,
    ...props
}) {
    const dialogRef = useRef(null);
    const openRef = useRef(open);

    useEffect(() => {
        openRef.current = open;
    }, [open]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (open && !dialog.open) {
            dialog.showModal();
        } else if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleCancel = (e) => {
            if (!closeOnEscape) {
                e.preventDefault();
                return;
            }

            e.preventDefault();
            onOpenChange?.(false);
        };

        const handleClose = () => {
            // only sync state if modal was previously open
            if (openRef.current) {
                onOpenChange?.(false);
            }
        };

        const handleClick = (e) => {
            if (!closeOnBackdrop) return;

            if (e.target === dialog) {
                onOpenChange?.(false);
            }
        };

        dialog.addEventListener("cancel", handleCancel);
        dialog.addEventListener("close", handleClose);
        dialog.addEventListener("click", handleClick);

        return () => {
            dialog.removeEventListener("cancel", handleCancel);
            dialog.removeEventListener("close", handleClose);
            dialog.removeEventListener("click", handleClick);
        };
    }, [onOpenChange, closeOnBackdrop, closeOnEscape]);

    return (
        <dialog ref={dialogRef} className={`${styles.modal} ${className}`} {...props}>
            {children}
        </dialog>
    );
}
