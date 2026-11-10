import mongoose from "mongoose";
import Project from "../models/projectModel.js";

const findGetProjectById = async(projectid, workspaceid) => {

    if(!mongoose.isValidObjectId(projectid)){
        return null
    }
    
    const project = await Project.findById(projectid);
    
    if(!project){
        return null
    }
    
    if(project.workspace.toString() !== workspaceid.toString()){
        return null
    }

    return project
}
export default findGetProjectById;