export default function getThemeColors() {
    const root = document.documentElement;
    const styles = getComputedStyle(root);

    return {
        // Base colors
        AccentColor: styles.getPropertyValue("--Accent-Color").trim(),
        PrimaryBG: styles.getPropertyValue("--Primary-BG").trim(),
        SecondaryBG: styles.getPropertyValue("--Secondary-BG").trim(),
        PrimaryText: styles.getPropertyValue("--Primary-Text").trim(),
        SecondaryText: styles.getPropertyValue("--Secondary-Text").trim(),
        AccentBG: styles.getPropertyValue("--Accent-BG").trim(),
        Disabled: styles.getPropertyValue("--Disabled").trim(),
        HoverBG: styles.getPropertyValue("--Hover-BG").trim(),

        // TaskBox colors
        TaskBoxP0: styles.getPropertyValue("--TaskBox-P0").trim(),
        TaskBoxP1: styles.getPropertyValue("--TaskBox-P1").trim(),
        TaskBoxP2: styles.getPropertyValue("--TaskBox-P2").trim(),
        TaskBoxP3: styles.getPropertyValue("--TaskBox-P3").trim(),

        TaskBoxP0BG: styles.getPropertyValue("--TaskBox-P0-BG").trim(),
        TaskBoxP1BG: styles.getPropertyValue("--TaskBox-P1-BG").trim(),
        TaskBoxP2BG: styles.getPropertyValue("--TaskBox-P2-BG").trim(),
        TaskBoxP3BG: styles.getPropertyValue("--TaskBox-P3-BG").trim(),

        // Fonts
        SerifFont: styles.getPropertyValue("--Serif-Font").trim(),
        SansSerifFont: styles.getPropertyValue("--Sans-Serif-Font").trim(),

        // Typography
        Heading1: styles.getPropertyValue("--Heading-1").trim(),
        Heading2: styles.getPropertyValue("--Heading-2").trim(),
        Heading3: styles.getPropertyValue("--Heading-3").trim(),
        Text1: styles.getPropertyValue("--Text-1").trim(),
        Text2: styles.getPropertyValue("--Text-2").trim(),
        Text3: styles.getPropertyValue("--Text-3").trim(),

        // Dates
        DateOverdue: styles.getPropertyValue("--DateOverdue").trim(),
        DateToday: styles.getPropertyValue("--DateToday").trim(),
        DateTomorrow: styles.getPropertyValue("--DateTomorrow").trim(),
        DateThisWeek: styles.getPropertyValue("--DateThisWeek").trim(),
        DateNextWeek: styles.getPropertyValue("--DateNextWeek").trim(),
        DateDefault: styles.getPropertyValue("--DateDefault").trim(),
    };
}


