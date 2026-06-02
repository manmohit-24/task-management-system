import { createSlice } from "@reduxjs/toolkit";
import {
    getRelativeDueDate,
    RELATIVE_DUE_DATE_COLORS,
} from "@/features/shared/libs/relativeDueDate";

const checkForTodayStatus = (state, todoId, eventName) => {
    const todo = state.Todos[todoId];
    const completedId = "Completed-today";

    let prettyDueDate = getRelativeDueDate(todo.dueDate);

    if (prettyDueDate[0] === "Today" && eventName !== "Delete") {
        // It is for Today
        if (!state.Sections.Today.todos.hasOwnProperty(todoId)) {
            state.Sections.Today.number++;
            state.Sections.Today.todos[todoId] = todo.order;
            state.Sections[completedId].todos[todoId] = todo.order;
        } else if (eventName === "ToogleComplete") {
            if (todo.completed) state.Sections.Today.number--;
            else state.Sections.Today.number++;
        }
    } else {
        // It is not for Today
        if (state.Sections.Today.todos.hasOwnProperty(todoId)) state.Sections.Today.number--;
        delete state.Sections.Today.todos[todoId];
        delete state.Sections[completedId].todos[todoId];
    }
    if (!todo.completed && prettyDueDate[1] === RELATIVE_DUE_DATE_COLORS.overdue) {
        // It is an Overdue
        if (!state.Sections.Overdue.todos.hasOwnProperty(todoId)) state.Sections.Overdue.number++;
        state.Sections.Overdue.todos[todoId] = todo.order;
    } else {
        // It is not an Overdue
        if (state.Sections.Overdue.todos.hasOwnProperty(todoId)) state.Sections.Overdue.number--;
        delete state.Sections.Overdue.todos[todoId];
    }
};

const TodoSlice = createSlice({
    name: "TodoData",
    initialState: {
        Tags: {},
        Sections: {},
        Todos: {},
        View: "List",
        EditingTaskId: null,
        visibleAddSection: false,
        HighestTagOrder: 0,
    },
    reducers: {
        setView: (state, action) => {
            state.View = action.payload.View;
        },

        // TODOS :
        setTodos: (state, action) => {
            state.Todos = action.payload.Todos;
        },
        toogleTodoCompleted: (state, action) => {
            state.Todos[action.payload.todoId].completed = action.payload.completed;
            const sectionId = state.Todos[action.payload.todoId].sectionId;

            if (sectionId) {
                if (action.payload.completed) state.Sections[sectionId].number--;
                else state.Sections[sectionId].number++;
            }
            checkForTodayStatus(state, action.payload.todoId, "ToogleComplete");
        },
        updateTodo: (state, action) => {
            const todoProps = Object.keys(action.payload.todo);

            for (let todoProp of todoProps) {
                state.Todos[action.payload.todoId][todoProp] = action.payload.todo[todoProp];

                if (todoProp === "dueDate") {
                    checkForTodayStatus(state, action.payload.todoId, "Update");
                }
            }
        },
        addTodo: (state, action) => {
            const todo = action.payload.todo;
            const todoId = action.payload.todoId;
            const sectionId = todo.sectionId;
            const completedId = `Completed-${state.Sections[sectionId]?.tagId}`;

            todo.order = state.Sections[sectionId].highestTodoOrder++;

            state.Todos[todoId] = todo;

            state.Sections[sectionId].todos[todoId] = todo.order;
            state.Sections[completedId].todos[todoId] = todo.order;
            state.Sections[sectionId].number++;

            checkForTodayStatus(state, todoId, "Add");
        },
        deleteTodo: (state, action) => {
            const todoId = action.payload.todoId;
            const todo = state.Todos[todoId];
            const sectionId = todo.sectionId;
            const completedId = `Completed-${state.Sections[sectionId]?.tagId}`;

            checkForTodayStatus(state, todoId, "Delete");

            if (!todo.completed) state.Sections[sectionId].number--;
            delete state.Sections[sectionId].todos[todoId];
            delete state.Sections[completedId].todos[todoId];
            delete state.Todos[todoId];
        },
        addSubTask: (state, action) => {
            const todoId = action.payload.todoId;
            const todo = action.payload.todo;
            const parentTodoId = action.payload.parentTaskId;
            const parentTodo = state.Todos[parentTodoId];
            todo.order = state.Sections[parentTodo.sectionId].highestTodoOrder++;

            todo.parentTodoId = parentTodoId;
            todo.isSubTask = true;

            state.Todos[todoId] = todo;

            if (parentTodo.subTasks) state.Todos[parentTodoId].subTasks[todoId] = todo.order;
            else state.Todos[parentTodoId].subTasks = { [todoId]: todo.order };

            checkForTodayStatus(state, todoId, "Add");
        },
        setEditingTaskId: (state, action) => {
            state.EditingTaskId = action.payload.todoId;
        },
        // Tags :

        setTags: (state, action) => {
            state.Tags = action.payload.Tags;
        },

        setHighestTagOrder: (state, action) => {
            state.HighestTagOrder = action.payload.HighestTagOrder;
        },

        addTag: (state, action) => {
            const tag = action.payload.tag;
            const tagId = action.payload.tagId;

            state.Sections[`NotSectioned-${tagId}`] = {
                sectionName: "Not Sectioned",
                tagId: tagId,
                order: -Infinity,
                number: 0,
                todos: {},
                highestTodoOrder: 0,
            };

            state.Sections[`Completed-${tagId}`] = {
                sectionName: "Completed",
                tagId: "inbox",
                order: Infinity,
                number: 0,
                todos: {},
                highestTodoOrder: 0,
            };

            let tagData = {
                title: tag?.title || "SideBarLabel",
                sections: {
                    [`NotSectioned-${tagId}`]: -Infinity,
                    [`Completed-${tagId}`]: Infinity,
                },
                number: 0,
                tagColor: tag?.tagColor || "#999999",
                order: state.HighestTagOrder++,
            };

            console.log(tagData);

            state.Tags[tagId] = tagData;
        },

        deleteTag: (state, action) => {
            const tagId = action.payload.tagId;
            Object.keys(state.Tags[tagId].sections).forEach((sectionId) => {
                delete state.Sections[sectionId];
            });

            delete state.Tags[tagId];
        },

        updateTag: (state, action) => {
            let tagProps = Object.keys(action.payload.tag);

            for (let tagProp of tagProps) {
                state.Tags[action.payload.tagId][tagProp] = action.payload.tag[tagProp];
            }
        },

        setSections: (state, action) => {
            state.Sections = action.payload.Sections;
        },

        showAddSection: (state, action) => {
            state.visibleAddSection = action.payload.visibleAddSection;
        },

        addSection: (state, action) => {
            const sectionId = action.payload.sectionId;
            console.log(action.payload.section.tagId);

            const sectionOrder = state.Tags[action.payload.section.tagId].highestSectionOrder++;
            const section = {
                ...action.payload.section,
                number: 0,
                todos: {},
                highestTodoOrder: 0,
                order: sectionOrder,
            };
            console.log(section);

            state.Sections[sectionId] = section;

            state.Tags[section.tagId].sections[sectionId] = sectionOrder;
        },

        deleteSection: (state, action) => {
            const sectionId = action.payload.sectionId;
            Object.keys(state.Sections[sectionId].todos).forEach((todoId) => {
                delete state.Todos[todoId];
            });
            delete state.Tags[state.Sections[sectionId].tagId].sections[sectionId];
            delete state.Sections[sectionId];
        },

        updateSection: (state, action) => {
            let sectionProps = Object.keys(action.payload.section);

            for (let sectionProp of sectionProps) {
                state.Sections[action.payload.sectionId][sectionProp] =
                    action.payload.section[sectionProp];
            }
        },
    },
});

export const {
    setView,

    setTodos,
    toogleTodoCompleted,
    addTodo,
    addSubTask,
    updateTodo,
    deleteTodo,
    setEditingTaskId,

    setHighestTagOrder,
    setTags,
    addTag,
    deleteTag,
    updateTag,

    setSections,
    showAddSection,
    addSection,
    deleteSection,
    updateSection,
} = TodoSlice.actions;
export default TodoSlice.reducer;

/** Todo Object format :
 * {
 *     id: 1 : {
            task: "Default Task",
            description: "Default Task Description",
            priority: 0,
            dueDate: //String Format
            subTasks: [], // Array of subTasks Ids
            tagId:, // default "inbox"
            sectionName: ,
            completed : false
        }
}
 */

/**CustomList Object format :
    {
        pageId : {
            title = 'SideBarLabel',
            sections = [],
            number = ''
        }
    }
     */

/** View Object format :
    {
        pageId-1 : "List"
        pageId-2 : "Board"
    }
     */
