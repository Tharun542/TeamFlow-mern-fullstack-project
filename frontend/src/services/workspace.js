
import API from "./api"

export const createWorkspace = async(workspace, token)=>{
    const response = await API.post("/v1/workspace", workspace, {
        headers : {
            Authorization: `Bearer ${token}`
        }
    })

    return response;
}


export const addMemberToWorkspace = async(id, body, token) => {
    const response = await API.post(`/v1/workspaces/${id}/member`, body, {
        headers : {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data;
}


export const updatememberrole = async(id, memberid, role, token)=>{
const response = await API.patch(`/v1/workspaces/${id}/member/${memberid}/role`,{
    role: role
}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data;
}


export const deleteMemberFromWorkspace = async(id, memberid, token) =>{
    const response = await API.delete(`/v1/workspaces/${id}/member/${memberid}`,
        {
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
}

export const deleteWorkspace = async(id, token) =>{
    const response = await API.delete(`/v1/workspaces/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
}
