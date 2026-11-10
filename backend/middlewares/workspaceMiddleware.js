import mongoose from "mongoose";
import workSpace from "../models/workspaceModel.js";

const workspaceMiddleware = (allowedRoles) => async(req, res, next) => {
    const workspaceId = req.params.id;
    const userId = req.id.userid;

    if(!workspaceId){
        return res.status(404).json({
            success: false,
            message: "create the workspace..!"
        })
    }

    if(!mongoose.isValidObjectId(workspaceId)){
        return res.status(400).json({
            success: false,
            message: "Invalid workspace Id...!"
        })
    }

    const workspace = await workSpace.findById(workspaceId);

    if(!workspace){
        return res.status(404).json({
            success: false,
            message: "workspace id not found...!"
        })
    }

    const members = workspace.members.find(
        (member) => member.user.toString() === userId.toString()
    )

    if(!allowedRoles.includes(members.role)){
        return res.status(403).json({
            success: false,
            message: "only workspace owner or admin can add member..!"
        })
    }

    req.member = members; //this is specific user in workspace which has specific role satified condition.
    req.workspace = workspace; // this is workspace object contain users.
    
    
    
    next()
}

export default workspaceMiddleware;