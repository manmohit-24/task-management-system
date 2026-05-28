import styles from "./DatePicker.module.css";
import { useEffect, useMemo, useState } from "react";

import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import { Today, Sunrise, Weekend, NextWeek } from "@/shared/icons";
import { CircleSlash } from "lucide-react";

const QUICK_ACTIONS = [
    {
        key: "today",
        title: "Today",
        Icon: Today,
        className: "todayButton",
    },
    {
        key: "tomorrow",
        title: "Tomorrow",
        Icon: Sunrise,
        className: "tomorrowButton",
    },

    {
        key: "weekend",
        title: "This Weekend",
        Icon: Weekend,
        className: "weekendButton",
    },
    {
        key: "monday",
        title: "Coming Monday",
        Icon: NextWeek,
        className: "mondayButton",
    },
    {
        key: "clear",
        title: "No Date",
        Icon: CircleSlash,
        className: "clearButton",
    },
];

export default function DatePicker({ dueDate, setDateValue }) {
    const [value, setValue] = useState(dueDate ? dayjs(dueDate) : null);

    useEffect(() => {
        setValue(dueDate ? dayjs(dueDate) : null);
    }, [dueDate]);

    useEffect(() => {
        setDateValue(value ? value.toDate() : null);
    }, [value, setDateValue]);

    const actions = useMemo(
        () => ({
            today: () => setValue(dayjs()),
            tomorrow: () => setValue(dayjs().add(1, "day")),
            weekend: () => {
                const today = dayjs();
                const daysUntilSaturday = (6 - today.day() + 7) % 7;
                setValue(today.add(daysUntilSaturday, "day"));
            },
            monday: () => {
                const today = dayjs();
                const daysUntilMonday = (8 - today.day()) % 7 || 7;
                setValue(today.add(daysUntilMonday, "day"));
            },

            clear: () => setValue(null),
        }),
        [],
    );

    return (
        <div className={styles.container} onClick={(e) => e.stopPropagation()}>
            <div className={styles.topButtons}>
                {QUICK_ACTIONS.map((action) => (
                    <button
                        key={action.key}
                        type="button"
                        title={action.title}
                        className={`${styles.actionButton} ${styles[action.className]}`}
                        onClick={actions[action.key]}
                    >
                        <action.Icon size={20} />
                    </button>
                ))}
            </div>

            <div className={styles.calendar}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                        value={value}
                        onChange={setValue}
                        views={["year", "month", "day"]}
                        className={styles.dateCalendar}
                    />
                </LocalizationProvider>
            </div>
        </div>
    );
}
