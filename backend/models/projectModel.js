import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'project name is required'],
        trim:true,
        minlength:2,
        maxlength:100
    },
    description:{
        type:String,
        required: [true, 'describe the project'],
        trim:true,
        minlength:2,
        maxlength:500
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'workspace',
        required: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'pending'],
        default: 'active'
    }
},
 {
    timestamps: true
}
)

const Project = mongoose.model("Project", projectSchema);
export default Project;