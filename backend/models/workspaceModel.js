import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'name is required'],
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },

        role: {
          type: String,
          enum: ["owner", "admin", "member", "viewer"],
          default: "member"
        }
      }
    ]
  },
  { timestamps: true }
)

const workSpace = mongoose.model("workspace", workspaceSchema);
export default workSpace;