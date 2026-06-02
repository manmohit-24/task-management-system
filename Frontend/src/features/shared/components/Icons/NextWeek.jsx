import { CalendarEmpty } from ".";
import { ArrowRightToLine } from "lucide-react";
export default function NextWeek({ size = 16, className = "", ...props }) {
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
                    fontSize: size * 0.3,
                    fontWeight: 500,
                    lineHeight: 1.1,
                    marginTop: size * 0.3,
                    pointerEvents: "none",
                    userSelect: "none",
                }}
            >
                <ArrowRightToLine size={size * 0.6} />
            </div>
        </div>
    );
}
