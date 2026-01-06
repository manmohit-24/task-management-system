import mongoose, { Schema } from "mongoose";

const sectionSchema = new Schema(
    {
        name:{
            type:String,
            trim:true,
            required:true
        },

        project:{
            type:Schema.Types.ObjectId,
            ref: "Project",
            required:true,       //* every section must have a project, this is how todoist behaves
            index:true
        },
        
        owner: {  // ADD THIS for efficiency
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        order: {
            type: Number,
            default:0
        },

        status: {
            type: String,
            enum: ["active", "archived"],
            default: "active",
            index: true,
        }

    },
    {
        timestamps:true
    }
)

export const Section = mongoose.model("Section", sectionSchema);