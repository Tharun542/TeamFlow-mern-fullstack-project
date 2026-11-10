import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required: [true, 'title is required'],
        trim: true,
        minlength: 2,
        maxlength:100
    },
    description:{
        type:String,
        required: [true, 'description field required'],
        trim: true,
        minlength:2,
        maxlength:500
    },
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Project',
        required: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    assignee:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:['todo', 'completed', 'in-progress'],
        default: 'todo'
    },
    priority:{
        type:String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
    },
    dueDate:{
        type: Date,
        default: null
    }
},  {
    timestamps:true
}
)

const Task = mongoose.model("Task", taskSchema);
export default Task;