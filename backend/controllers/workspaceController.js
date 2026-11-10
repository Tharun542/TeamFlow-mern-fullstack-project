import mongoose from "mongoose";
import workSpace from "../models/workspaceModel.js";
import User from '../models/userModel.js';
import findWorkspace from "../services/workspaceSerivce.js";

const workspace = async(req, res)=>{
    const userId = req.id.userid;

    if(!userId){
        return res.status(401).json({
            success: false,
            message: 'authentication required..!'
        })
    }

    const user = await workSpace.create({
        name: req.body.name,
        owner: userId,
        members: [
            {
                user: userId,
                role: "owner"
            }
        ]
    })

    if(!user){
        return res.status(401).json({
            success: false,
            message: "provide the userId..!"
        })
    }
    
    return res.status(201).json({
        success: true,
        message: "workspace created successfully..!",
        user: user
    })
}

const getWorkspace = async(req, res)=>{

    try{
        const userId = req.id?.userid;

        if(!userId){
            return res.status(401).json({
                success: false,
                message: "authentication required or token expired..!"
            })
        }

        const workspace = await findWorkspace(userId);

        return res.status(200).json({
            success: true,
            message: "workspace retrieved successfully..!",
            data: workspace
        })

    }catch(err){
        return err
    }   
}

const getWorkSpaceById = async(req, res)=>{
    try{
        const workspaces = req.workspace;

        return res.status(200).json({
            success:true,
            message: "workspace retrieved successfully..!",
            data: workspaces
        })        
    }
    catch(err){
        return err
    }  
}

const addMemberToWorkspace = async(req, res)=>{

    try{
        const { email, role= "member" } = req.body;
        if(!email){
            return res.status(400).json({
                success: false,
                message: "email is required..!"
            })
        }
        const allowedRoles = ["admin", "member", "viewer"]
        if(!allowedRoles.includes(role)){
            return res.status(400).json({
                success: false,
                message: "Invalid member role..!"
            })
        }
        const requester = req.member;
        const workspaceMember = req.workspace;
        if(role === 'admin' && requester.role !== "owner"){
            return res.status(403).json({
                success: false,
                message: "only owner can provide the access admin role..!"
            })
        }
        const newUser = await User.findOne({
            email: email
        })
        if(!newUser){
            return res.status(404).json({
                success: false,
                message: "User account not be found..!"
            })
        }
        const alreadyMember = workspaceMember.members.some(
            (member)=> member.user.toString() === newUser._id.toString()
        )
        if(alreadyMember){
            return res.status(409).json({
                success: false,
                message: "user already exist in workspace as member..!"
            })
        }
        workspaceMember.members.push({
            user: newUser._id,
            role
        });
        workspaceMember.save();
        return res.status(200).json({
            success: true,
            message: "member added to the workspace successfully...!",
            data: workspaceMember
        })
    }
    catch(err){
        return err
    }
}

const updateMemberRole = async(req, res) => {

    try{
        const workspace = req.workspace;
        const { role } = req.body
        const member = req.params.memberid;

        if(!member){
            return res.status(400).json({
                success: false,
                message: "member id required..!"
            })
        }

        const allowedRoles = ["admin", 'viewer', 'member']

        if(!allowedRoles.includes(role)){
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            })
        }

        const existMember = workspace.members.find(
            (mem)=> mem.user.toString() === member.toString()
        )

        if(!existMember){
            return res.status(404).json({
                success: false,
                message: "member does not exist in workspace...!"
            })
        }

        if(existMember.role === 'owner'){
            return res.status(403).json({
                success: false,
                message: "cannot change the workspace owner's role..!"
            })
        }

        existMember.role = role;

       await workspace.save();

        return res.status(200).json({
            success: false,
            message: "member role changed successfully..!",
            data: workspace
        })
    }
    catch(err){
        return err
    }
    
}

const deleteMemberWorkspace = async(req, res) =>{
    try{
        const member = req.params.memberid;
        const workspace = req.workspace;
        const requester = req.member.role;
        console.log(member);
        if(!member){
            return res.status(400).json({
                success: false,
                message: "memberID required..!"
            })
        }

        const existedMemberIndex = workspace.members.findIndex(
            (mem) =>  mem.user.toString() === member.toString()
        )

        if(existedMemberIndex === -1){
            console.log("123")
            return res.status(404).json({
                success: false,
                message: "member does not exist"
            })
        }

        const existedMember = workspace.members[existedMemberIndex];

        if(existedMember.role ===  'owner'){
            return res.status(403).json({
                success:false,
                message: 'cannot removed the owner...'
            })
        }

        if(existedMember.role === 'admin' && requester === 'admin'){
            return res.status(403).json({
                success:false,
                message: 'admins cannot removed admins...'
            })
        }


        if(!existedMember){
            console.log("456")
            return res.status(404).json({
                success: false,
                message: 'member does not exist '
            })
        }

        if(existedMember.role === 'owner'){
            return res.status(403).json({
                success: false,
                message: 'Cannot removed the owner from the workspace..! '
            })
        }

        workspace.members.splice(existedMemberIndex, 1);

        await workspace.save()
        return res.status(201).json({
            success: true,
            message: 'member deleted succesfully...',
            data: workspace
        })
    }
    catch(err){
        return err
    }
}

const deleteWorkspace = async(req, res) => {
    try{
        const workspace = req.workspace;

        if(!workspace){
            return res.status(404).json({
                success: false,
                message: 'workspace not found'
            })
        }

        await workspace.deleteOne();

        return res.status(201).json({
            success:false,
            message:'workspace deleted successfully...'
        })

    }catch(err){
        return err
    }
}

export default {workspace, 
    getWorkspace, 
    getWorkSpaceById, 
    addMemberToWorkspace, 
    updateMemberRole,
    deleteMemberWorkspace,
    deleteWorkspace
}