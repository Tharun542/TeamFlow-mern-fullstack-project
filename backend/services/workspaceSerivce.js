import Project from "../models/projectModel.js";
import workSpace from "../models/workspaceModel.js";

const findWorkspace = async(userid) =>{
    const workspaces = await workSpace.find({
            "members.user": userid
        });

        if(workspaces.length === 0){
            return null;
        }

        return workspaces;
}
export default findWorkspace;