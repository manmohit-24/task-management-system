import { Project } from "../models/project.model.js";
import { Todo } from "../models/to-do.model.js";      
import { Section } from "../models/section.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const createProject = async (req, res, next) => {
    try {
        const { name } = req.body;
        
        if (!name?.trim()) {
            throw new apiError(400, "project name is required");
        }

        const trimmedName = name.trim();

        //* we are not allowing duplicate project names and we will also not allow project name === "inbox"
        if (trimmedName.toLowerCase() === "inbox") {
            throw new apiError(400, "inbox is a reserved project name");
        }

        const existingProject = await Project.findOne({
            owner: req.user._id,
            name: trimmedName,
        });

        if (existingProject) {
            throw new apiError(409, "Project with this name already exists");
        }

        //* Calculate order (new project goes to end)
        const lastProject = await Project.findOne({ owner: req.user._id })
            .sort({ order: -1 }) //desc order
            .select("order"); // i only want order not any other property

        const newOrder = lastProject ? lastProject.order + 1 : 1;

        // Create project
        const project = await Project.create({
            name: trimmedName,
            owner: req.user._id,
            order: newOrder,
            isInbox: false,
            status: "active",
        });

        return res
            .status(201)
            .json(
                new apiResponse(201, project, "Project created successfully"),
            );
    } catch (error) {
        next(error);
    }
};

const getAllProjects = async (req, res, next) => {
    try {
        // Step 1 -> Query database
        // - we need to Filter by owner (req.user._id) 
        // - and Filter by status ("active")
        // - and in the end Sort by order (ascending)
        
        const projects = await Project.find({
            owner: req.user._id,    
            status: "active" // we are not gonna send archived to the ui 
        }).sort({order:1}) //* this means asc sorting on the basis of order 
    
    //* NOTE - find always returns arrays of object so we will have multiple objects wrapped inside array in projects
        // Step 2 -> Return response using apiResponse
        return res
        .status(200)
        .json(
            new apiResponse(200, projects, "Projects fetched successfully")
        );
    } catch (error) {
        next(error);
    }
};

const updateProject = async (req, res, next) => {
    try {
        const { id } = req.params;  // Project ID from URL
        const { name, status } = req.body;  //* we are allowing these Fields to update, ordering will be handled separately
        
        if (!name && !status) {
            throw new apiError(400, "Nothing to update");
        }

        //* Step 1: Find project and verify ownership
        // - Find by id
        // - Check if owner === req.user._id
        
        // This is safer and cleaner than findById + if check
        const project = await Project.findOne({ 
            _id: id, 
            owner: req.user._id 
        });

        if (!project) {
            throw new apiError(404, "Project not found");
        }

        //* Step 2: Validations
        // - If updating to archived AND isInbox === true → Reject
        // - If renaming to "Inbox" → Reject
        // - If renaming, check for duplicate names

        //* 3. NAME UPDATE LOGIC
        if (name) {
            const trimmedName = name.trim();

            //  Don't allow empty names
            if (!trimmedName) {
                throw new apiError(400, "Project name cannot be empty");
            }

            //  Protected "Inbox"
            if (project.isInbox) {
                throw new apiError(403, "You cannot rename the Inbox");
            }

            //  Reserved word "Inbox"
            if (trimmedName.toLowerCase() === "inbox") {
                throw new apiError(400, "'Inbox' is a reserved project name");
            }

            //  Duplicate Check (Only if name is ACTUALLY changing)
            if (trimmedName !== project.name) {
                const existingProject = await Project.findOne({
                    owner: req.user._id,
                    name: trimmedName
                });
                if (existingProject) {
                    throw new apiError(409, "Project with this name already exists");
                }
                project.name = trimmedName;
            }
        }

        //* 4. STATUS UPDATE LOGIC
        if (status) {
            //  we shouldn't archive the Inbox
            if (project.isInbox && status !== "active") {
                throw new apiError(400, "Inbox cannot be archived");
            }
            
            //  specific check for valid status strings
            const validStatuses = ["active", "archived"];
            if (!validStatuses.includes(status)) {
                throw new apiError(400, "Invalid status");
            }

            project.status = status;
        }

        //* 5. Save and Return
        const updatedProject = await project.save();

        return res
            .status(200)
            .json(
                new apiResponse(200, updatedProject, "Project updated successfully")
            );
            
    } catch (error) {
        next(error);
    }
};

const deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Step 1: Find project and verify ownership
        const project = await Project.findOne({ 
            _id: id, 
            owner: req.user._id 
        });

        if (!project) {
            throw new apiError(404, "Project not found");
        }

        // Step 2: Cannot delete Inbox
        if (project.isInbox) {
            throw new apiError(403, "Inbox cannot be deleted");
        }

        // Step 3: Delete all todos in this project
        await Todo.deleteMany({ project: id });

        // Step 4: Delete all sections in this project
        await Section.deleteMany({ project: id });

        // Step 5: Delete the project
        await Project.findByIdAndDelete(id);

        // Return response
        return res
            .status(200)
            .json(
                new apiResponse(200, {}, "Project deleted successfully")
            );
            
    } catch (error) {
        next(error);
    }
};

export { createProject, getAllProjects, updateProject, deleteProject };