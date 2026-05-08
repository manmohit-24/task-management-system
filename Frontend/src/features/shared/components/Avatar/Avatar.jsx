// Avatar.jsx

import styles from "./Avatar.module.css";

const COLOR_PAIRS = [
    ["#6366F1", "#8B5CF6"], // Indigo → Purple
    ["#0EA5E9", "#06B6D4"], // Sky → Cyan
    ["#10B981", "#14B8A6"], // Emerald → Teal
    ["#F59E0B", "#F97316"], // Amber → Orange
    ["#EF4444", "#EC4899"], // Red → Pink
    ["#84CC16", "#22C55E"], // Lime → Green
];

function getColorPair(seed = "") {
    let hash = 0;

    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    return COLOR_PAIRS[Math.abs(hash) % COLOR_PAIRS.length];
}

export default function Avatar({ name = "", size = "md", className = "" }) {
    const initials = name.charAt(0).toUpperCase();

    const [start, end] = getColorPair(name);

    return (
        <div
            className={`
                ${styles.avatar}
                ${styles[size]}
                ${className}
            `}
            style={{
                background: `linear-gradient(135deg, ${start}, ${end})`,
            }}
        >
            {initials}
        </div>
    );
}
