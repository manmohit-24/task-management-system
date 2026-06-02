import { Todo } from "../models/to-do.model.js";
import { Project } from "../models/project.model.js";
import { Section } from "../models/section.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const createTodo = async (req, res, next) => {
    try {
        const { 
            content, 
            description,
            project: projectId, //* we are just renaming it to projectId for clarity of names nothing much 
            section: sectionId, 
            parentId,
            priority,
            dueDate 
        } = req.body;

        // 1. Content required
        if (!content?.trim()) {
            throw new apiError(400, "Task content is required");
        }

        // 2. Find project (use Inbox if not provided)
        let project;
        if (projectId) { 
            //* if projectid is given then make sure it exists and belongs to the user only

            project = await Project.findOne({ 
                _id: projectId, 
                owner: req.user._id 
            });

            //* either project doesnt exist or user doesnt own that project, we throw error
            if (!project) {
                throw new apiError(404, "Project not found");
            }

        } else {
            //* as we are implementing , we must default to inbox if no project id is provided by the user
            project = await Project.findOne({ 
                owner: req.user._id, 
                isInbox: true  //* find the inbox project belonging to the user 
            });
        }

        // 3. Validate section (if provided)
        if (sectionId) {
            const section = await Section.findOne({ 
                _id: sectionId, 
                project: project._id 
            });
            if (!section) {
                throw new apiError(404, "Section not found in this project");
            }
        }

        // 4. Validate parent task (if subtask)
        if (parentId) {
            const parentTask = await Todo.findOne({ 
                _id: parentId, 
                owner: req.user._id 
            });
            if (!parentTask) {
                throw new apiError(404, "Parent task not found");
            }
        }

        // 5. Calculate order
        const lastTodo = await Todo.findOne({ 
            project: project._id,
            section: sectionId || null, 
            parentId: parentId || null // same logic here if undefined 
        }).sort({ order: -1 }).select("order");

        const newOrder = lastTodo ? lastTodo.order + 1 : 0;

        // 6. Create todo
        const todo = await Todo.create({
            content: content.trim(),
            description: description?.trim() || "",
            owner: req.user._id,
            project: project._id,
            section: sectionId || null, //In JavaScript: undefined or null evaluates to null.
            // Mongoose saves null in the database. This is exactly what we want the Todo belongs to the Project, but not to any specific Section.
            parentId: parentId || null,
            priority: priority || 4, //* no need to validate if the gievn priority is within range because mongoose does it for us 
            dueDate: dueDate || null,
            order: newOrder,
            status: "active"
        });

        return res
            .status(201)
            .json(new apiResponse(201, todo, "Task created successfully"));

    } catch (error) {
        next(error);
    }
};

const getTodos = async (req, res, next) => {
    try {
        const { project, status, section, parentId, dueDate } = req.query;
        
        // Build query - owner is always included for security purposes because we dont want to display data not belonging to a user  
        const query = {
            owner: req.user._id
        };
        
        // Add project filter if provided
        if (project) {
            query.project = project;
        }
        
        // add status filter 
        if (status) {
            const validStatuses = ["active", "completed", "archived", "deleted"];
            if (!validStatuses.includes(status)) {
                throw new apiError(400, "Invalid status");
            }
            query.status = status;
        } else {
            //* we assume if the client has not provided a status filter then it is an active task
            query.status = "active";  // Default to active todos only
        }
        
        // add section filter if provided
        if (section !== undefined) {
            if (section === "null") {
                query.section = null;
            } else if (section === "") {
                throw new apiError(400, "Invalid section filter");
            } else {
                query.section = section;
            }
        }
        
        // add parent filter if provided
        //! NOTE FOR THE FRONTEND - backend is not responsible for organising subtasks within a parent task array , i am sending a flat array containing parentId (if) 
        //! frontend must check if parentId exists then it is arranged into subtasks of parent task
        if (parentId) {
            if (parentId === "null") {
                query.parentId = null;  // if parent id is not given then User explicitly wants only main tasks
            } else {
                query.parentId = parentId;  // User wants subtasks of specific parent
            }
        }
        
        if (dueDate) {
            if (dueDate === "today") {
                const start = new Date();
                start.setHours(0, 0, 0, 0);  // 12:00:00 AM
                
                const end = new Date();
                end.setHours(23, 59, 59, 999);  // 11:59:59 PM
                
                query.dueDate = { $gte: start, $lte: end };
                // $gte = greater than or equal
                // $lte = less than or equal
            } 
            
            else if (dueDate === "upcoming") {
                // All tasks with future due dates
                query.dueDate = { $gt: new Date() };
            }

            else if (dueDate === "overdue") {
                // Past due dates that are NOT completed
                query.dueDate = { $lt: new Date() };
                query.status = "active";  // Only show active overdue
            }

            else {
                // Specific date: "2025-01-15"
                const specificDate = new Date(dueDate);
                
                if (isNaN(specificDate.getTime())) {
                    throw new apiError(400, "Invalid date format");
                }

                const start = new Date(specificDate);
                start.setHours(0, 0, 0, 0);
                
                const end = new Date(specificDate);
                end.setHours(23, 59, 59, 999);
                
                query.dueDate = { $gte: start, $lte: end };
            }
        }
        
        // db call
        const todos = await Todo.find(query)
            .sort({ order: 1 , createdAt: -1 }) //* Newest appear at top if order is same
            .select("-__v");  
        
        return res
            .status(200)
            .json(new apiResponse(200, todos, "Todos fetched successfully"));
            
    } catch (error) {
        next(error);
    }
};

//* adding one more functionality to fetch a task only by its id, maybe it will be helpful if we only want to see details of one task
// * this will save time as we dont have to load projects and other stuff
const getTodoById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const todo = await Todo.findOne({
            _id: id,
            owner: req.user._id  
        }).select("-__v");
        
        if (!todo) {
            throw new apiError(404, "Todo not found");
        }
        
        return res
            .status(200)
            .json(new apiResponse(200, todo, "Todo fetched successfully"));
            
    } catch (error) {
        next(error);
    }
};

const updateTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { 
            content, 
            description, 
            priority, 
            dueDate, 
            project,
            section,
            parentId
        } = req.body;

        // Find and verify ownership
        const todo = await Todo.findOne({
            _id: id,
            owner: req.user._id
        });

        if (!todo) {
            throw new apiError(404, "Todo not found");
        }

        // Update only provided fields
        if (content !== undefined) todo.content = content.trim();
        if (description !== undefined) todo.description = description.trim();
        if (priority !== undefined) todo.priority = priority;
        if (dueDate !== undefined) todo.dueDate = dueDate;

        //  Nesting/Un-nesting Logic (The Drag & Drop Core)
        if (parentId !== undefined) {
            if (parentId === null) {
                //* it is main task
                // CASE: Un-nesting (Subtask -> Main Task)
                todo.parentId = null;
                // If un-nesting, we might also be dropping into a section (handled below in step 4)
            } else {
                // CASE: Nesting (Main/Subtask -> New Parent)
                //* this means either i am making a prev main task a subtask under a new parent or i am changing parent of a subtask
                // Verify the new parent exists
                const parentTask = await Todo.findById(parentId);
                if (!parentTask) {
                    throw new apiError(404, "Target parent task not found");
                }
                
                // Prevent circular reference (A task cannot be its own parent)
                if (parentId === id) {
                    throw new apiError(400, "Cannot make a task its own parent");
                }

                todo.parentId = parentId;
                todo.section = null; //* rule -> if u have a parent , we dont care about your section but only your parent
            
                // CRITICAL: If moving to a parent in a DIFFERENT project, sync everything
                if (todo.project.toString() !== parentTask.project.toString()) {
                    todo.project = parentTask.project;
                    
                    await Todo.updateMany({ parentId: id }, { project: parentTask.project });
                }
            }
        }

        //* If moving to new project, clear section
        if (project && project !== todo.project.toString()) {
            todo.project = project;
            todo.section = null;  //* because Section might not exist in new project
            todo.parentId = null;

            await Todo.updateMany(
                { parentId: id }, // Find all immediate children
                { project: project } // Move them to the new project too
            ) 
            
        } else if (section !== undefined) {
            // ONLY ALLOW SECTION IF IT IS A ROOT TASK
            if (todo.parentId === null) { // because we decided that subtasks cant have section
                todo.section = section; 
            } //* moving to a new section OF SAME PROJECT , wrapped it in else if condition because we dont allow section to be changed while changing projects, only one thing can be changed 
        }

        await todo.save();

        return res
            .status(200)
            .json(new apiResponse(200, todo, "Todo updated successfully"));
            
    } catch (error) {
        next(error);
    }
};

// Separate toggle function for separation of concerns
const toggleTodo = async (req, res, next) => {
    // //! PRODUCT DECISIONS -> 
    //* Toggle ON (Complete):
    //  - If I complete a **Parent** -> Complete **ALL** its subtasks. (Save the user clicks).
    // - If I complete a **Subtask** -> Do nothing to Parent. (Parent stays active until the user manually checks it).
        
	//* - **Toggle OFF (Restore/Uncheck):**
    // - If I restore a **Parent** -> Do **NOT** restore subtasks. (Assume they are still done).
    // - If I restore a **Subtask** -> **MUST** restore the Parent. (To avoid hiding the active subtask). 

    try {
        const { id } = req.params;

        const todo = await Todo.findOne({
            _id: id,
            owner: req.user._id
        });

        if (!todo) {
            throw new apiError(404, "Todo not found");
        }

        // Can't toggle deleted/archived todos
        if (todo.status === "deleted" || todo.status === "archived") {
            throw new apiError(400, "Cannot toggle deleted or archived todo");
        }

        const isCompleting = todo.status === "active"; // if iscompleting is true that means user is moving the todo from active to completed stage
        const isSubtask = todo.parentId !== null; // if it has a parent id then it is a subtask

        if (isCompleting) {
            //* ========== COMPLETING ==========
            todo.status = "completed";
            todo.completedAt = new Date();

            // if it had no parent id then it was a parent task itself -> !isSubtask
            // Parent completed → Complete ALL subtasks
            if (!isSubtask) {
                await Todo.updateMany(
                    { 
                        parentId: id, 
                        owner: req.user._id, 
                        status: "active" 
                    },
                    { 
                        status: "completed", 
                        completedAt: new Date() 
                    }
                );
            }
            // now if it was a subtask,then we simply have to mark it as completed (which we did already)
            // Subtask completed → Do nothing to parent

        } else {
            //* ========== UNCOMPLETING ==========
            todo.status = "active";
            todo.completedAt = null;

            // Subtask uncompleted → MUST restore parent
            if (isSubtask) {
                await Todo.findOneAndUpdate(
                    { 
                        _id: todo.parentId, 
                        owner: req.user._id,
                        status: "completed"  // Only if parent is completed
                    },
                    { 
                        status: "active", 
                        completedAt: null 
                    }
                );
            }
            // Parent uncompleted → Do NOT restore subtasks
        }

        await todo.save();

        return res
            .status(200)
            .json(new apiResponse(200, todo, "Todo toggled successfully"));
            
    } catch (error) {
        next(error);
    }
};

const deleteTodo = async (req, res, next) => {
    //! NOTE - if user wants to delete a parent task then we cascade delete the subtasks (soft delete) but if user only wants to delete subtask then we implement hard delete
    //* reason for this is minimalistic handling in the restore function which prevents a deadlock situation which was arising if subtask was to be resoted but the parent was still active
    // i only wanted to restore a subtask if the parent is restored otherwise there shouldnt be any other way to restore the subtask
    // but this was probelamatic as if user only deleted the subtask and wants to restore it while parent is still active -> deadlock
    // to prevent this i am making hard delete scenario for subtasks, to justify it we can clearly see the subtasks are just minor details in parent tasks and dont need to be soft deleted
    try {
        const { id } = req.params;
        
        // Check what we're deleting
        const todo = await Todo.findOne({ 
            _id: id, 
            owner: req.user._id 
        });
        
        if (!todo) {
            throw new apiError(404, "Todo not found");
        }

        // SCENARIO A: Subtask → HARD DELETE
        if (todo.parentId) {
            await Todo.findByIdAndDelete(id);  // or todo.deleteOne()
            return res
                .status(200)
                .json(new apiResponse(200, {}, "Subtask deleted permanently"));
        }

        // SCENARIO B: Main Task → SOFT DELETE
        // 1. Soft delete parent
        todo.status = "deleted";
        await todo.save();

        // 2. Cascade soft delete children
        await Todo.updateMany(
            { parentId: id, owner: req.user._id }, 
            { status: "deleted" }
        );

        return res
            .status(200)
            .json(new apiResponse(200, {}, "Task moved to trash"));
        
    } catch (error) {
        next(error);
    }
};

const restoreTodo = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Only main tasks can be in trash (subtasks are hard deleted)
        const todo = await Todo.findOneAndUpdate(
            { 
                _id: id, 
                owner: req.user._id,
                status: "deleted",
                parentId: null  // Only main tasks
            },
            { status: "active" }, //* restoration of the main task
            { new: true }
        );

        if (!todo) {
            throw new apiError(404, "Task not found in trash");
        }

        // Restore its subtasks -> as i wanted to implement -> soft delete sub taksks only if parent is itself soft deleted otherwise never allow soft deletion of subtasks
        await Todo.updateMany(
            { parentId: id, owner: req.user._id, status: "deleted" },
            { status: "active" }
        );

        return res
            .status(200)
            .json(new apiResponse(200, todo, "Task restored from trash"));
            
    } catch (error) {
        next(error);
    }
};



export { createTodo, getTodos, getTodoById, updateTodo, toggleTodo, deleteTodo , restoreTodo};