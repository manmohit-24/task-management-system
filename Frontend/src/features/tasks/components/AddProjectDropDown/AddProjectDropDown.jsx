import styles from "./AddProjectDropDown.module.css";
import { Plus, CirclePlus, LayoutGrid } from "lucide-react";
import { useState, useEffect } from "react";
import { Dropdown } from "@/shared/components/";
import { getThemeColor } from "@/features/themes/libs/themeColors";
import { useForm } from "react-hook-form";
import { useCreateProject } from "../../hooks/project.hooks";

export default function AddProjectDropDown({ className }) {
    const [open, setOpen] = useState(false);
    const disabledCol = getThemeColor("Disabled");

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
        setFocus,
        setError,
        reset,
    } = useForm({
        defaultValues: {
            color: disabledCol,
        },
    });

    const { mutate: createProject } = useCreateProject({
        onError: (error) => {
            setError(error);
        },
        onSuccess: () => {
            setOpen(false);
            reset();
        },
    });

    useEffect(() => {
        setFocus("name");
    }, [setFocus, open]);

    const onOpenChange = (val) => {
        if (!watch("name")) reset();
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
                onSubmit={handleSubmit(createProject)}
            >
                <div className={styles.icon}>
                    <LayoutGrid size={18} />
                    <input type="color" {...register("color")} />
                </div>

                <input
                    type="text"
                    placeholder="New List"
                    className={styles.input}
                    {...register("name", { required: "Please enter a name" })}
                />
                <div className={styles.error}>{errors.name?.message}</div>

                <button type="submit" className={styles.addButton}>
                    <CirclePlus size={16} className={styles.addIcon} />
                    Add Project
                </button>
            </form>
        </Dropdown>
    );
}
