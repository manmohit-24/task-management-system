import { CalendarEmpty } from "./";

export default function Today({ size = 16, className = "", ...props }) {
    const day = new Date().getDate();

    return (
        <div
            className={className}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: size,
                height: size,
                position: "relative",
            }}
            {...props}
        >
            <CalendarEmpty size={size} style={{ position: "absolute" }} />

            <div
                style={{
                    fontSize: size * 0.5,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    marginTop: size * 0.3,
                    pointerEvents: "none",
                    userSelect: "none",
                }}
            >
                {day}
            </div>
        </div>
    );
}
