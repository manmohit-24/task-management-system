import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Modal } from "@/shared/components/";
import styles from "./ConfirmDeleteProvider.module.css";
import { X } from "lucide-react";

const ConfirmDeleteContext = createContext(null);

export function ConfirmDeleteProvider({ children }) {
    const [state, setState] = useState({
        open: false,
        title: "Proceed with the delete ?",
        description: "This action cannot be undone",
        onConfirm: null,
    });

    const close = useCallback(() => {
        setState((prev) => ({
            ...prev,
            open: false,
        }));
    }, []);

    const confirm = useCallback(() => {
        state.onConfirm?.();
        close();
    }, [state, close]);

    const showConfirmDelete = useCallback(({ title, description, onConfirm }) => {
        setState({
            open: true,
            title: title ?? "Proceed with the delete ?",
            description: description ?? "This action cannot be undone",
            onConfirm,
        });
    }, []);

    const value = useMemo(
        () => ({
            showConfirmDelete,
            closeConfirmDelete: close,
        }),
        [showConfirmDelete, close],
    );

    return (
        <ConfirmDeleteContext.Provider value={value}>
            {children}
            <Modal
                open={state.open}
                onOpenChange={(open) => {
                    if (!open) close();
                }}
                className={styles.container}
            >
                <div className={styles.header}>
                    <h3 className={styles.action}>Confirm Delete</h3>

                    <button className={styles.closeButton} onClick={close}>
                        <X size={16} />
                    </button>
                </div>

                <div className={styles.body}>
                    <p className={styles.title}>{state.title}</p>

                    <p className={styles.description}>{state.description}</p>

                    <div className={styles.actions}>
                        <button className={styles.cancelButton} onClick={close}>
                            Cancel
                        </button>

                        <button className={styles.confirmButton} onClick={confirm}>
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </ConfirmDeleteContext.Provider>
    );
}

export function useConfirmDelete() {
    const context = useContext(ConfirmDeleteContext);

    if (!context) {
        throw new Error("useConfirmDelete must be used inside ConfirmDeleteProvider");
    }

    return context;
}
