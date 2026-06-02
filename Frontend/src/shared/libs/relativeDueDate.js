import dayjs from "dayjs";

import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

export const RELATIVE_DUE_DATE_COLORS = Object.freeze({
    overdue: "#d1453b",
    today: "#4B9244",
    tomorrow: "#E69641",
    thisWeek: "#0071ff",
    nextWeek: "#8647D9",
    default: "var(--text-secondary)",
});

// Returns formatted current date string.
export function getPrettyTodayString() {
    return dayjs().format("dddd, DD MMM");
}

export function getRelativeDueDate(dateInput) {
    if (!dateInput) {
        return {
            label: "No Date",
            color: RELATIVE_DUE_DATE_COLORS.default,
            state: "none",
        };
    }

    const date = dayjs(dateInput);

    if (!date.isValid()) {
        return {
            label: "Invalid Date",
            color: RELATIVE_DUE_DATE_COLORS.default,
            state: "invalid",
        };
    }

    const today = dayjs().startOf("day");
    const tomorrow = today.add(1, "day");
    const currentYear = today.year();

    // DECISION : Week ends on Sunday.

    const currentDayIndex = today.day();
    const daysUntilSunday = (7 - currentDayIndex) % 7;
    const thisSunday = today.add(daysUntilSunday, "day");
    const nextSunday = thisSunday.add(7, "day");

    // Overdue
    if (date.isBefore(today, "day")) {
        return {
            label: date.year() < currentYear ? date.format("DD MMM, YYYY") : date.format("DD MMM"),
            color: RELATIVE_DUE_DATE_COLORS.overdue,
            state: "overdue",
        };
    }

    // Today
    if (date.isSame(today, "day")) {
        return {
            label: "Today",
            color: RELATIVE_DUE_DATE_COLORS.today,
            state: "today",
        };
    }

    // Tomorrow
    if (date.isSame(tomorrow, "day")) {
        return {
            label: "Tomorrow",
            color: RELATIVE_DUE_DATE_COLORS.tomorrow,
            state: "tomorrow",
        };
    }

    // This week
    if (date.isAfter(today, "day") && date.isSameOrBefore(thisSunday, "day")) {
        return {
            label: date.format("ddd"),
            color: RELATIVE_DUE_DATE_COLORS.thisWeek,
            state: "thisWeek",
        };
    }

    // Next week
    if (date.isAfter(thisSunday, "day") && date.isSameOrBefore(nextSunday, "day")) {
        return {
            label: date.format("ddd, DD MMM"),
            color: RELATIVE_DUE_DATE_COLORS.nextWeek,
            state: "nextWeek",
        };
    }

    // Default future dates
    return {
        label: date.year() > currentYear ? date.format("DD MMM, YYYY") : date.format("DD MMM"),
        color: RELATIVE_DUE_DATE_COLORS.default,
        state: "future",
    };
}
