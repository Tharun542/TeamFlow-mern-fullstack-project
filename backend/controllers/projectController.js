import mongoose from "mongoose";
import Project from "../models/projectModel.js";
import findGetProjectById from '../services/projectService.js'
import findWorkspace from "../services/workspaceSerivce.js";
import Task from "../models/taskModel.js";

const createProject = async(req, res, next) => {
    try{
        const { name, description } = req.body;
        const workspace = req.workspace;
        const user = req.id.userid;

        if(!name?.trim() || !description?.trim()){
            return res.status(400).json({
                success: false,
                message: 'name and description field required..!',
            })
        }

        const createdProject = await Project.create({
            name: name,
            description: description,
            workspace: workspace._id,
            createdBy: user
        })

        return res.status(201).json({
            success: true,
            message: 'project created successfully...',
            details: createdProject
        })
    }
    catch(err){
        next(err)
    }
}

const getProjects = async(req, res, next)=>{
    try{
        const userid = req.id.userid;
        const projects = await findWorkspace(userid);

        const workspaceID = projects.map(
            (user)=> user._id
        )
        
        const project = await Project.find({
            'workspace': workspaceID
        })
        
        res.status(200).json({
            success: true,
            message: "project's worspace of user-logged retrieved successfully",
            data: project
        })
    }
    catch(err){
        next(err)
    }
}

const getProjectsByWorkspaceId = async(req, res, next)=> {
    try{
        const workspace = req.workspace;

        if(!workspace){
            return res.status(400).json({
                success: false,
                message: 'workspace id required..'
            })
        }
        
        const projects = await Project.find(
            {workspace: workspace._id}
        )

        return res.status(200).json({
            success: true,
            message: 'projects retrieved successfully...',
            data : projects
        })
    }
    catch(err){
        next(err)
    }
}

const getProjectById = async(req, res, next) => {
    
    try{
        const project = await findGetProjectById(req.params.projectid, req.workspace._id);

        if(!project){
            return res.status(404).json({
                success: false,
                message: 'Project not found in this workspace...'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'project retrieved successfully...',
            data: project
        })
    }catch(err){
        next(err)
    }
}

const updateProject = async(req, res, next) => {
    try{
        const project = await findGetProjectById(
            req.params.projectid,
            req.workspace._id
        );

        if(!project){
            return res.status(404).json({
                success: false,
                message: 'Project not found in this workspace...'
            })
        }

        const { name, description, status } = req.body;

        if(!name?.trim() || !description?.trim()){
            return res.status(400).json({
                success: false,
                message: 'name and description fields are required..'
            })
        }

        project.name = name;
        project.description = description;
        project.status = status;

        await project.save();
        return res.status(200).json({
            success: true,
            message: 'project updated successfully...',
            data: project
        })

    }catch(err){
        next(err)
    }
}

const deleteProject = async(req, res, next)=>{
    try{
        const project = await findGetProjectById(
            req.params.projectid,
            req.workspace._id
        )

        if(!project){
            return res.status(404).json({
                success: false,
                message: 'project not found in this workspace..'
            })
        }

        await Task.deleteMany({
            "project": project._id
        });

        await project.deleteOne();
        return res.status(200).json({
            success: true,
            message: "project deleted successfully",
        })
    }
    catch(err){
        next(err)
    }
}

export default {createProject,
    getProjectsByWorkspaceId,
    getProjectById,
    updateProject,
    deleteProject,
    getProjects
};