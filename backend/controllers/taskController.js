import findGetProjectById from "../services/projectService.js";
import Task from "../models/taskModel.js";
import {filterTheTasks, findTaskByTaskid, taskDetailsVerify} from "../services/taskService.js";


const createTask = async(req, res, next) =>{
    try{
        
        const task = await taskDetailsVerify(req.body);
        const workspace = await req.workspace;
        const project = await findGetProjectById(req.params.projectid, workspace._id);
       
        if(!project){
            return res.status(404).json({
                success: false, 
                message: 'project does not exist in this workspace'
            })
        }

        const existedUser = workspace.members.some(
            (member) => member.user.toString() === req.body.assignee.toString()
        )

      

        if(!existedUser){
           
            return res.status(404).json({
                success: false,
                message: 'member does not exist in workspace..!'
            })
        }

        if(!task.valid){
          
            return res.status(400).json({
                success: false,
                message: task.message
            })
        }

        const taskDetails = await Task.create(
            {
                title:req.body.title,
                description:req.body.description,
                createdBy: req.id.userid,
                assignee:req.body.assignee,
                status: req.body.status,
                priority: req.body.priority,
                project: project._id,
                dueDate : req.body.dueDate
            }
        )

        return res.status(201).json({
            success:true,
            message: 'task assigned successfully.',
            details: taskDetails
        })
    }
    catch(err){
        next(err)
    }
}

const getTasksByProject =async(req, res, next) => {
    try{
        const project = await findGetProjectById(
            req.params.projectid, req.workspace._id
        );

        if(!project){
            return res.status(404).json({
                success: false,
                message: "project does not exist in the workspace"
            })
        }

        const tasks = await Task.find(
            {"project": project._id}
        )        

        return res.status(200).json({
            success: true,
            message: 'tasks of related project retrieved successfully',
            taskDetails: tasks
        })
    }
    catch(err){
        next(err)
    }
}

const getTaskByTaskId = async(req, res, next) => {
    try{
        const taskdetails = await findTaskByTaskid(req.params.taskid);
        const workspace = await req.workspace;

        if(!taskdetails){
            return res.status(404).json({
                success: false,
                message: "taskdetails does not found or invalid task id..!"
            })
        }
        
        const project = await findGetProjectById(taskdetails.project, workspace._id);

        if(!project){
            return res.status(404).json({
                success: false,
                message: "task's project does not exist in this workspace..!"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Task's project retrieved successfully",
            details: taskdetails
        })
        
    }
    catch(err){
        next(err)
    }
}

const updateTask = async(req, res, next) =>{
    try{
        const taskdetails = await findTaskByTaskid(req.params.taskid);
        const workspace = req.workspace;
        const task = await taskDetailsVerify(req.body, true);

        if(!task.valid){
            return res.status(400).json({
            success: false,
            message: validation.message
            });
        }

        if(!taskdetails){
            return res.status(404).json({
                success: false,
                message: "task ID not found or invalid ID..!"
            })
        }

        const projectDetails = await findGetProjectById(
            taskdetails.project,
            workspace._id
        )

        if(!projectDetails){
            return res.status(404).json({
                success: false,
                message: "task's project does not exist in the workspace..!"
            })
        }

        const assignValues = ["title", 'description', 'assignee', 'status', 'priority', 'dueDate']
        const updatedData = {};

        for(let item of assignValues){
            if(req.body[item] !== undefined){
                updatedData[item] = req.body[item]
            }
        }

        if(Object.keys(updatedData).length === 0){
            return res.status(400).json({
                success: false,
                message: "Provide atleast one field to update"
            })
        }

        const updateTask = await Task.findByIdAndUpdate(
            req.params.taskid,
            { $set: updatedData },
            {returnDocument: "after", runValidators: true }
        )

        return res.status(200).json({
            success: true,
            message: "task's project details updated successfully",
            data: updateTask
        })
    }
    catch(err){
        next(err)
    }
}

const deleteTask = async(req, res, next) => {
    try{
        const { taskid } = req.params;
    
        const taskdetails = await findTaskByTaskid(taskid);
        
        const workspace = req.workspace;

        if(!taskdetails){
            return res.status(404).json({
                success: false,
                message: "Task Id not found or Invalid ID..!"
            })
        }

        const project = await findGetProjectById(taskdetails.project, workspace._id);

        if(!project){
            return res.status(404).json({
                success: false,
                message: "Task's project doesnot exist in this workspace..!"
            })
        }

        await taskdetails.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Task deleted successfully.."
        })
    }
    catch(err){
        next(err)
    }
}

const userGetAssignedTask = async(req, res, next) => {
    try{
        const tasks = await filterTheTasks(req.id.userid, req.query);

        if(tasks === null){
            return res.status(400).json({
                success: false,
                message: "Invalid filter, sorting, or pagination parameters"
            })
        }

        return res.status(200).json({
            success: true,
            message: 'User assigned tasks',
            data: tasks
        })
    }
    catch(err){
        next(err)
    }
}



export default {createTask,
    getTasksByProject,
    getTaskByTaskId,
    updateTask,
    deleteTask,
    userGetAssignedTask
};