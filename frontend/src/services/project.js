import API from "./api"

export const createProject =async(id, body, token)=>{
    
    const response = await API.post(`/v1/project/workspaces/${id}/projects`, body, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response;
}

export const updateProject = async(id, projectid, body, token)=>{
    const response = await API.patch(`/v1/project/workspaces/${id}/project/${projectid}`, body, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data;
    
}

export const deleteProject = async(id, projectid, token) => {
    const response = await API.delete(`/v1/project/workspaces/${id}/project/${projectid}`, {
        headers : {
            Authorization : `Bearer ${token}`
        }
    })

    return response.data;
}