import { createContext, useContext, useState } from "react";

/*===== Context =====*/
const UIContext = createContext(null);

/*===== Local Storage Helpers =====*/
const getSidebarState = () => {
    const value = localStorage.getItem("isSidebarExpanded");
    return value === null ? true : value === "true";
};

const getViewState = () => {
    const value = localStorage.getItem("view");
    return value ?? "list";
};

/*===== Provider =====*/
// Provides with layout related states of task page components :
// - view
// - sidebarExpanded

export function TaskLayoutProvider({ children }) {
    /*===== Sidebar =====*/
    const [sidebarExpanded, setSidebarExpandedState] = useState(getSidebarState);

    const setSidebarExpanded = (value) => {
        localStorage.setItem("isSidebarExpanded", String(value));
        setSidebarExpandedState(value);
    };

    /*===== View Mode =====*/
    const [view, setViewState] = useState(getViewState);

    const toggleView = () => {
        setViewState((prev) => {
            const next = prev === "list" ? "board" : "list";

            localStorage.setItem("view", next);
            return next;
        });
    };

    return (
        <UIContext.Provider
            value={{
                sidebarExpanded,
                setSidebarExpanded,
                view,
                toggleView,
            }}
        >
            {children}
        </UIContext.Provider>
    );
}

/*===== Base Hook =====*/

export function useTaskLayout() {
    const context = useContext(UIContext);

    if (!context) {
        throw new Error("useTaskLayout must be used inside TaskLayoutProvider");
    }

    return context;
}

/*===== Sidebar =====*/

export function useSidebarState() {
    const { sidebarExpanded, setSidebarExpanded } = useTaskLayout();

    return {
        expanded: sidebarExpanded,
        setExpanded: setSidebarExpanded,
    };
}

/*===== View Mode =====*/

export function useViewMode() {
    const { view, toggleView } = useTaskLayout();

    return {
        view,
        toggleView,
    };
}
