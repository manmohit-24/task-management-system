import styles from "./ConfirmDeleteDialog.module.css";
import { useEffect, useRef } from "react";
import { Modal } from "@/shared/components";
import { Button } from "@/shared/components";
import { X } from "lucide-react";

export default function ConfirmDeleteDialog({
    open,
    title,
    description,
    loading,
    onConfirm,
    onClose,
}) {
    // ===== Focus Delete Button On Open =====
    const deleteButtonRef = useRef(null);

    useEffect(() => {
        if (open) deleteButtonRef.current?.focus();
    }, [open]);

    return (
        <Modal
            open={open}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
            className={styles.container}
        >
            {/*===== Header ===== */}
            <div className={styles.header}>
                <h3 className={styles.action}>Confirm Delete</h3>

                <button className={styles.closeButton} onClick={onClose} disabled={loading}>
                    <X size={16} />
                </button>
            </div>

            {/*===== Body ===== */}
            <div className={styles.body}>
                <p className={styles.title}>{title}</p>

                <p className={styles.description}>{description}</p>

                {/*===== Actions ===== */}
                <div className={styles.actions}>
                    <Button variant={"secondary"} onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>

                    <Button ref={deleteButtonRef} onClick={onConfirm} disabled={loading}>
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
