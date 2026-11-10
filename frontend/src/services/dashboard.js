import API from "./api"

export const dashboard =async(token) =>{
    const response = await API.get("/v1/workspaces", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const projects = async(token)=>{
    const response = await API.get("/v1/project/my-projects",{
        headers:{
            Authorization: `Bearer ${token}`
        }
    })

    return response.data;
}

export const tasks = async(token)=>{
    const response = await API.get("/v1/tasks/my-tasks", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data.data;
}