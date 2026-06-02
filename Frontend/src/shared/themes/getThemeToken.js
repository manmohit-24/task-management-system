export const getThemeToken = (token) => {
    return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
};
