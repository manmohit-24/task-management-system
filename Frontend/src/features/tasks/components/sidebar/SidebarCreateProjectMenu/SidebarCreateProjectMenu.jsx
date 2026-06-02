import styles from "./SidebarCreateProjectMenu.module.css";
import { useState } from "react";
import { useCreateProject } from "@/features/tasks/hooks/project.hooks";
import { useNavigate } from "react-router-dom";

import { getThemeToken } from "@/shared/themes";
import { Dropdown } from "@/shared/components/";
import { SidebarProjectForm } from "..";
import { toast } from "sonner";
import { Plus, LayoutGrid } from "lucide-react";

export default function SidebarCreateProjectMenu({ className, onActionInProgressChange }) {
    const navigate = useNavigate();

    const handleNavigation = (projectId) => {
        navigate(`/app/${projectId}`);
    };

    const [open, setOpen] = useState(false);
    const defaultCol = getThemeToken("--text-secondary");

    const { mutate: createProject } = useCreateProject({
        onSuccess: (data) => handleNavigation(data.data._id),
        onError: (error) => toast.error(error.message),
    });

    const handleDropdownOpenChange = (val) => {
        setOpen(val);
        onActionInProgressChange(val);
    };

    const handleCreateProject = (data) => {
        createProject(data);
        onActionInProgressChange(false);
        setOpen(false);
    };

    return (
        <Dropdown
            trigger={<Plus size={16} />}
            onOpenChange={handleDropdownOpenChange}
            open={open}
            className={{ trigger: className, menu: styles.container }}
        >
            <SidebarProjectForm
                variant="add"
                initial={{
                    name: "",
                    color: defaultCol,
                    icon: LayoutGrid,
                }}
                onSubmit={handleCreateProject}
            />
        </Dropdown>
    );
}
