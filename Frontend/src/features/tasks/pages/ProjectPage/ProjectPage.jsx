import styles from "./ProjectPage.module.css";
import { useSections } from "@/features/tasks/hooks/section.hooks";
import { useViewMode } from "../../TaskLayoutProvider/TaskLayoutProvider";

import { Section, SectionCreateForm, UnsectionedTasksSection } from "../../components/section";

export default function ProjectPage({ project, addingSection, setAddingSection }) {
    const { view } = useViewMode();

    const { data } = useSections(project);
    const sections = data ? data : [];

    return (
        <main className={`${styles.container} ${styles[view]}`}>
            <div className={styles.section}>
                <UnsectionedTasksSection project={project} />
            </div>
            {sections.map(({ _id, name, project }) => (
                <div key={_id} className={styles.section}>
                    <Section id={_id} name={name} project={project} />
                </div>
            ))}

            <div className={styles.addSection}>
                <SectionCreateForm
                    open={addingSection}
                    onOpenChange={setAddingSection}
                    project={project}
                />
            </div>
        </main>
    );
}
