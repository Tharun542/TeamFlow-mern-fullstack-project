import API from "./api"

export const createTask = async(id, projectid, body ,token) => {
    const response = await API.post(`/v1/tasks/workspaces/${id}/project/${projectid}/task`, body, {
        headers:{
            Authorization: `Bearer ${token}`
        }
    })

    return response.data;
}

export const deleteTask = async(workspaceid, taskid, token) => {
    const response = await API.delete(`/v1/tasks/workspaces/${workspaceid}/task/${taskid}`, {
        headers : {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data;
}