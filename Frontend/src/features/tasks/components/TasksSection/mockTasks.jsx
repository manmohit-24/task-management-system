export const MOCK_TASKS = [
    {
        id: "task-1",
        content: "Design dashboard layout",
        description:
            "Refactor spacing, typography hierarchy, and responsive grid behavior for the analytics dashboard.",
        priority: 1,
        completed: false,
        dueDate: "2026-05-20T10:00:00.000Z",

        section: {
            id: "section-ui",
            name: "UI Polish",
        },

        project: {
            id: "project-frontend",
            name: "Frontend",
            color: "#8b5cf6",
        },

        isSubTask: false,

        subTasks: [
            {
                id: "task-1-sub-1",
                content: "Improve card spacing",
                description: "Normalize padding and vertical rhythm across dashboard widgets.",
                priority: 3,
                completed: false,
                dueDate: "2026-05-19T08:00:00.000Z",

                section: {
                    id: "section-ui",
                    name: "UI Polish",
                },

                project: {
                    id: "project-css",
                    name: "CSS",
                    color: "#ec4899",
                },

                isSubTask: true,
                subTasks: [],
            },

            {
                id: "task-1-sub-2",
                content: "Create hover motion system",
                description:
                    "Unify transitions and elevation animations for all interactive surfaces.",
                priority: 2,
                completed: true,
                dueDate: "2026-05-18T16:00:00.000Z",

                section: {
                    id: "section-motion",
                    name: "Animations",
                },

                project: {
                    id: "project-motion",
                    name: "Motion",
                    color: "#06b6d4",
                },

                isSubTask: true,
                subTasks: [],
            },
        ],
    },

    {
        id: "task-2",
        content: "Implement drag and drop",
        description: "Build sortable task movement for both list and board views using DnD Kit.",
        priority: 2,
        completed: false,
        dueDate: "2026-05-24T14:30:00.000Z",

        section: {
            id: "section-interactions",
            name: "Interactions",
        },

        project: {
            id: "project-react",
            name: "React",
            color: "#0ea5e9",
        },

        isSubTask: false,

        subTasks: [
            {
                id: "task-2-sub-1",
                content: "Handle collision detection",
                description: "Tune closest-center behavior for nested subtasks and columns.",
                priority: 4,
                completed: false,
                dueDate: "2026-05-25T09:00:00.000Z",

                section: {
                    id: "section-dnd",
                    name: "DnD",
                },

                project: {
                    id: "project-dnd",
                    name: "DnD",
                    color: "#f97316",
                },

                isSubTask: true,
                subTasks: [],
            },
        ],
    },

    {
        id: "task-3",
        content: "Refactor task card architecture",
        description:
            "Convert global styles into modular CSS and isolate interaction logic from layout rendering.",
        priority: 1,
        completed: false,
        dueDate: "2026-05-21T11:00:00.000Z",

        section: {
            id: "section-architecture",
            name: "Architecture",
        },

        project: {
            id: "project-system",
            name: "System",
            color: "#22c55e",
        },

        isSubTask: false,

        subTasks: [],
    },

    {
        id: "task-4",
        content: "Fix mobile overflow issues",
        description: "Prevent metadata wrapping and horizontal overflow on narrow screens.",
        priority: 3,
        completed: true,
        dueDate: "2026-05-17T07:00:00.000Z",

        section: {
            id: "section-responsive",
            name: "Responsive",
        },

        project: {
            id: "project-bug",
            name: "Bug",
            color: "#ef4444",
        },

        isSubTask: false,

        subTasks: [],
    },

    {
        id: "task-5",
        content: "Build optimistic update flow",
        description: "Introduce optimistic mutations for completion toggles and due-date updates.",
        priority: 2,
        completed: false,
        dueDate: "2026-05-28T18:00:00.000Z",

        section: {
            id: "section-backend",
            name: "State Sync",
        },

        project: {
            id: "project-query",
            name: "TanStack",
            color: "#f59e0b",
        },

        isSubTask: false,

        subTasks: [
            {
                id: "task-5-sub-1",
                content: "Handle rollback states",
                description: "Revert UI correctly on mutation failure.",
                priority: 3,
                completed: false,
                dueDate: "2026-05-29T12:00:00.000Z",

                section: {
                    id: "section-backend",
                    name: "State Sync",
                },

                project: {
                    id: "project-api",
                    name: "API",
                    color: "#14b8a6",
                },

                isSubTask: true,
                subTasks: [],
            },

            {
                id: "task-5-sub-2",
                content: "Add loading indicators",
                description: "Create subtle pending states without shifting layout.",
                priority: 4,
                completed: false,
                dueDate: "2026-05-30T15:00:00.000Z",

                section: {
                    id: "section-feedback",
                    name: "UX",
                },

                project: {
                    id: "project-ux",
                    name: "UX",
                    color: "#a855f7",
                },

                isSubTask: true,
                subTasks: [],
            },
        ],
    },
];
