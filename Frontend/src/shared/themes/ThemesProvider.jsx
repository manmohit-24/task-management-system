import { createContext, useContext, useEffect, useState, useMemo } from "react";

const THEME_KEY = "theme";

export const THEMES = {
    LIGHT: "light",
    DARK: "dark",
    SYSTEM: "system",
};

const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

const ThemeContext = createContext(null);

// ===== Theme persistence helpers =====
const getSavedThemePreference = () => {
    const stored = localStorage.getItem(THEME_KEY);

    if (Object.values(THEMES).includes(stored)) return stored;

    return THEMES.SYSTEM;
};

// ===== System theme helpers =====
const getCurrentSystemTheme = () =>
    window.matchMedia(DARK_MEDIA_QUERY).matches ? THEMES.DARK : THEMES.LIGHT;

// ===== Theme Provider =====
export function ThemeProvider({ children }) {
    // ===== User theme preference =====
    const [theme, setTheme] = useState(getSavedThemePreference);

    useEffect(() => {
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    // ===== System theme sync =====
    const [systemTheme, setSystemTheme] = useState(getCurrentSystemTheme);

    useEffect(() => {
        const media = window.matchMedia(DARK_MEDIA_QUERY);

        const handleChange = (e) => {
            setSystemTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
        };

        media.addEventListener("change", handleChange);

        return () => {
            media.removeEventListener("change", handleChange);
        };
    }, []);

    // ===== Resolved theme =====
    const resolvedTheme = theme === THEMES.SYSTEM ? systemTheme : theme;

    // ===== DOM theme application =====
    useEffect(() => {
        document.documentElement.classList.toggle(THEMES.DARK, resolvedTheme === THEMES.DARK);
    }, [resolvedTheme]);

    const value = useMemo(
        () => ({
            theme,
            setTheme,
            resolvedTheme,
        }),
        [theme, resolvedTheme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ===== Hook =====
export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) throw new Error("useTheme must be used inside ThemeProvider");

    return context;
}
