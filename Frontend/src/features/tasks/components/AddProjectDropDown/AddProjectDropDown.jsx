import styles from "./AddProjectDropDown.module.css";
import { Plus, CirclePlus, LayoutGrid } from "lucide-react";
import { useState, useEffect } from "react";
import { Dropdown } from "@/features/shared/components/";
import { getThemeColor } from "@/features/themes/libs/themeColors";
import { useForm } from "react-hook-form";

export default function AddProjectDropDown({ className }) {
    const [open, setOpen] = useState(false);
    const disabledCol = getThemeColor("Disabled");

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
        setFocus,
        reset,
    } = useForm({
        defaultValues: {
            color: disabledCol,
        },
    });

    const addNewProject = (data) => {
        console.log(data);
        // Backend logic here
        reset();
        setOpen(false);
    };

    useEffect(() => {
        setFocus("title");
    }, [setFocus, open]);

    const onOpenChange = (val) => {
        if (!watch("title")) reset();
        setOpen(val);
    };

    return (
        <Dropdown
            trigger={<Plus size={16} />}
            onOpenChange={onOpenChange}
            open={open}
            className={{ trigger: className }}
        >
            <form
                className={styles.container}
                style={{ "--selectedColor": watch("color") }}
                onSubmit={handleSubmit(addNewProject)}
            >
                <div className={styles.icon}>
                    <LayoutGrid size={18} />
                    <input type="color" {...register("color")} />
                </div>

                <input
                    type="text"
                    placeholder="New List"
                    className={styles.input}
                    {...register("title", { required: "Please enter a title" })}
                />
                <div className={styles.error}>{errors.title?.message}</div>

                <button type="submit" className={styles.addButton}>
                    <CirclePlus size={16} className={styles.addIcon} />
                    Add Project
                </button>
            </form>
        </Dropdown>
    );
}
