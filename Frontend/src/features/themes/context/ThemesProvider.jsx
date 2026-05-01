import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./ThemesContext";

const THEME_KEY = "theme";

export function ThemeProvider({ children }) {
    const getSavedThemePreference = () => {
        const stored = localStorage.getItem(THEME_KEY);

        if (stored === "light" || stored === "dark" || stored === "system") return stored;

        return "system";
    };

    const getCurrentSystemTheme = () =>
        window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    // User-selected preference: "light" | "dark" | "system"
    const [userTheme, setUserTheme] = useState(getSavedThemePreference);

    // Current OS theme: "light" | "dark"
    const [systemTheme, setSystemTheme] = useState(getCurrentSystemTheme);

    // Final applied theme: "light" | "dark"
    const activeTheme = userTheme === "system" ? systemTheme : userTheme;

    useEffect(() => {
        document.documentElement.classList.toggle("dark", activeTheme === "dark");
    }, [activeTheme]);

    useEffect(() => {
        localStorage.setItem(THEME_KEY, userTheme);
    }, [userTheme]);

    // watch OS theme changes
    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (e) => {
            setSystemTheme(e.matches ? "dark" : "light");
        };

        media.addEventListener("change", handleChange);

        return () => {
            media.removeEventListener("change", handleChange);
        };
    }, []);

    const value = useMemo(
        () => ({
            userTheme,
            setUserTheme,
            activeTheme,
        }),
        [userTheme, activeTheme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
