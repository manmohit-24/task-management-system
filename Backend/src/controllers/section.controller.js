import { Section } from "../models/section.model.js";
import { Project } from "../models/project.model.js";
import { Todo } from "../models/to-do.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";


const createSection = async (req, res, next) => {
    try {
        const { name, project: projectId } = req.body;

        // Validate input
        if (!name?.trim()) {
            throw new apiError(400, "Section name is required");
        }

        if (!projectId) {
            throw new apiError(400, "Project ID is required");
        }

        // Verify project exists and belongs to user 
        const project = await Project.findOne({
            _id: projectId,
            owner: req.user._id
        });

        if (!project) {
            throw new apiError(404, "Project not found");
        }

        // REMOVED duplicate check - allow duplicate names -> we follow the todoist behaviour

        // Calculate order
        const lastSection = await Section.findOne({ 
            project: projectId 
        }).sort({ order: -1 }).select("order");

        const newOrder = lastSection ? lastSection.order + 1 : 0;

        // Create section
        const section = await Section.create({
            name: name.trim(),
            project: projectId,
            owner: req.user._id,
            order: newOrder,
            status: "active"
        });

        return res
            .status(201)
            .json(new apiResponse(201, section, "Section created successfully"));

    } catch (error) {
        next(error);
    }
};

const getSections = async (req, res, next) => {
    try {
        const { project } = req.query;

        // Build query
        const query = {
            owner: req.user._id,
            status: "active" // we are only interested in active sections
        };

        //  Just add project to query if provided - NO validation -> we can safely return empty array if it is a get request
        if (project) {
            query.project = project;
        }

        // If project doesn't exist or doesn't belong to user, returns [] 
        const sections = await Section.find(query)
            .sort({order: 1 })
            .select("-__v");

        return res
            .status(200)
            .json(new apiResponse(200, sections, "Sections fetched successfully"));

    } catch (error) {
        next(error);
    }
};


const updateSection = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        if (!name && !status) {
            throw new apiError(400, "Nothing to update");
        }

        // Find section and verify ownership
        const section = await Section.findOne({
            _id: id,
            owner: req.user._id
        });

        if (!section) {
            throw new apiError(404, "Section not found");
        }

        // Update name if provided
        if (name) {
            const trimmedName = name.trim();
            
            if (!trimmedName) {
                throw new apiError(400, "Section name cannot be empty");
            }

            section.name = trimmedName;
        }

        // Update status if provided
        if (status) {
            const validStatuses = ["active", "archived"];
            if (!validStatuses.includes(status)) {
                throw new apiError(400, "Invalid status");
            }
            section.status = status;
        }

        await section.save();

        return res
            .status(200)
            .json(new apiResponse(200, section, "Section updated successfully"));

    } catch (error) {
        next(error);
    }
};

const deleteSection = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find section and verify ownership
        const section = await Section.findOne({
            _id: id,
            owner: req.user._id
        });

        if (!section) {
            throw new apiError(404, "Section not found");
        }

        // Delete all todos in this section (cascade delete)
        await Todo.updateMany(
            { 
                section: id,
                owner: req.user._id 
            },
            { 
                status: "deleted" ,
                section: null //* the reason for this is we do not allow soft delete for sections, but the tasks inside them must be soft deleted for consistency
                //* now if the section was deleted but the tasks inside it will still carry invalid section id which must be set to null
            }
        );

        // Delete the section
        await Section.findByIdAndDelete(id);

        return res
            .status(200)
            .json(new apiResponse(200, {}, "Section and its todos deleted successfully"));

    } catch (error) {
        next(error);
    }
};

export { createSection, getSections, updateSection, deleteSection };