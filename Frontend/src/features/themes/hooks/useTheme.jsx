import { useContext } from "react";
import { ThemeContext } from "../context/ThemesContext";

export function useThemes() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useThemes must be used inside ThemeProvider");
    }

    return context;
}
