import { useState, useEffect } from "react"
import workspaceContext from "./AuthContext"
import { dashboard, projects, tasks } from "../services/dashboard";
function WorkspaceProvider({children}){
    const [ workspace, setWorkspace ] = useState([]);
    const [projectCount, setProjectcount] = useState([]);
    const [taskCollect, setTaskCollect] = useState([]);
    const [error, setError] = useState('');
    const token = localStorage.getItem("token")
    

    useEffect(()=>{
            const fetchWorkspace = async()=>{
               
                try{
                    const data = await dashboard(token);
                    const project = await projects(token);
                    const task = await tasks(token);
                    setWorkspace(data.data || []);
                    setProjectcount(project.data || []);
                    setTaskCollect(task.task || []);
                    setTaskCount(task.pagination?.totalTasks || 0);
                }
                catch(err){
                    setError(err?.response?.data?.message || "failed to fetch wrokspace")
                }
            }
            if(token){
                fetchWorkspace()
            }else{
                setError("Please login first");
            }
    
        },[token])
    return(
        <workspaceContext.Provider value={{workspace, setWorkspace, projectCount, setProjectcount, taskCollect, setTaskCollect}}>
            {children}
        </workspaceContext.Provider>
    )
}
export default WorkspaceProvider;