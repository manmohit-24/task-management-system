import styles from "./ActionsMenu.module.css";
import { useState } from "react";
import { Dropdown } from "@/shared/components";
import { Ellipsis } from "lucide-react";

/**
 * items:
 *
 * Action:
 * { type: "action", label, icon?, onClick, className?, closeOnSelect? }
 *
 * Separator:
 * { type: "separator" }
 *
 * Custom:
 * { type: "custom", content }
 */

export default function ActionsMenu({
    children = <Ellipsis size={18} strokeWidth={2} />,
    items = [],
}) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <Dropdown
            open={menuOpen}
            onOpenChange={setMenuOpen}
            className={{
                trigger: styles.trigger,
                menu: styles.menu,
            }}
            trigger={children}
        >
            {items.map((item, i) => {
                if (item.type === "custom") return <div key={i}>{item.content}</div>;

                if (item.type === "separator") return <div key={i} className={styles.separator} />;

                const Icon = item?.icon;
                return (
                    <button
                        key={i}
                        type="button"
                        className={`${styles.menuItem} ${item?.className ?? ""}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            item?.onClick();
                            if (item?.closeOnSelect ?? true) setMenuOpen(false);
                        }}
                    >
                        {Icon && <Icon size={14} />} {item?.label}
                    </button>
                );
            })}
        </Dropdown>
    );
}
