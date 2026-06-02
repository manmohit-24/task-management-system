import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

// ===== Context =====
const ConfirmDeleteContext = createContext(null);

// ===== Initial State =====
const INITIAL_STATE = {
    open: false,
    title: "Proceed with the delete?",
    description: "This action cannot be undone.",
    onConfirm: null,
};

// ===== Providerr =====
export function ConfirmDeleteProvider({ children }) {
    const [state, setState] = useState(INITIAL_STATE);

    const [isDeleting, setIsDeleting] = useState(false);

    // ===== Close Dialog =====
    const closeConfirmDelete = useCallback(() => {
        if (isDeleting) return; // Prevent closing while delete request is running
        state?.onCancel?.();
        setState(INITIAL_STATE); // reset
    }, [isDeleting, state]);

    // ===== Open Dialog =====
    const showConfirmDelete = useCallback(({ title, description, onConfirm, onCancel }) => {
        setState({
            open: true,
            title: title ?? INITIAL_STATE.title,
            description: description ?? INITIAL_STATE.description,
            onConfirm,
            onCancel,
        });
    }, []);

    // ===== Confirm Action =====
    const confirmDelete = useCallback(async () => {
        if (!state.onConfirm || isDeleting) return;

        try {
            setIsDeleting(true);
            await state.onConfirm();
            setState(INITIAL_STATE); // reset
        } finally {
            setIsDeleting(false);
        }
    }, [state, isDeleting]);

    // ===== Context Value =====
    const value = useMemo(
        () => ({
            showConfirmDelete,
            closeConfirmDelete,
        }),
        [showConfirmDelete, closeConfirmDelete],
    );

    return (
        <ConfirmDeleteContext.Provider value={value}>
            {children}

            <ConfirmDeleteDialog
                open={state.open}
                title={state.title}
                description={state.description}
                loading={isDeleting}
                onClose={closeConfirmDelete}
                onConfirm={confirmDelete}
            />
        </ConfirmDeleteContext.Provider>
    );
}

// ===== Hook =====
export function useConfirmDelete() {
    const context = useContext(ConfirmDeleteContext);

    if (!context) {
        throw new Error("useConfirmDelete must be used inside ConfirmDeleteProvider");
    }

    return context;
}
