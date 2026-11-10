import mongoose from "mongoose"
import Task from "../models/taskModel.js"

const taskDetailsVerify = async( taskdetails, isUpdate = false ) =>{
    const { title, description, assignee, priority, dueDate, status } = taskdetails;
    if (!isUpdate) {
        if (!title?.trim() || !description?.trim() || !assignee) {
            return {
                valid: false,
                message: "Title, description, and assignee are required"
            };
        }
    }
    if (title !== undefined &&
        (typeof title !== "string" || !title.trim())) {
        return { valid: false, message: "Invalid title" };
    }
    if (description !== undefined &&
        (typeof description !== "string" || !description.trim())) {
        return { valid: false, message: "Invalid description" };
    }
    if (priority !== undefined &&
        !["low", "medium", "high"].includes(priority)) {
        return { valid: false, message: "Invalid priority" };
    }
    if (status !== undefined &&
        !["todo", "in-progress", "completed"].includes(status)) {
        return { valid: false, message: "Invalid status" };
    }

    if (dueDate !== undefined &&
        dueDate !== null &&
        (typeof dueDate !== "string" || Number.isNaN(Date.parse(dueDate)))) {
        return { valid: false, message: "Invalid due date" };
    }

    return { valid: true };
};


const findTaskByTaskid = async( taskid ) => {

    if(!mongoose.isValidObjectId(taskid)){
        return null
    }

    const taskdetails = await Task.findById(taskid);

    if(!taskdetails){
        return null
    }

    return taskdetails;
}

const filterTheTasks = async(userid, params) => {

    const filter = {
            assignee:userid
        }

        const { sortBy = "dueDate", order = "asc", page = 1, limit = 10, ...filters } = params;

        // sortby order are default values which comes from query params if we not send any query  related--
        // --to sortby order it wll take duedate asc as defualt.

        const allowedQuery = ['status', 'priority', 'dueDate'];

        const allowedValues = {
            status : Task.schema.path("status").enumValues,
            priority : Task.schema.path("priority").enumValues
        }
        
        for(let [key, value] of Object.entries(filters)){

            if(!allowedQuery.includes(key)){
                return null
            }

            if(allowedValues[key] && !allowedValues[key].includes(value)){
                return null
            }
            if(value === undefined || value === ""){
                return null
            }
            if(key === "dueDate" && Number.isNaN(Date.parse(value))){
                return null;
            }

            filter[key] = value;
        }

        const allowedsort = ['dueDate', 'createdAt', 'priority'];
        const allowedOrder = ['asc', 'desc'];

        if(!allowedsort.includes(sortBy)){
                return null
            }

        if(!allowedOrder?.includes(order)){
            return null
        }

        const sort = {
            [sortBy]: order === 'asc' ? 1 : -1
        }
      
        const numberPage = Number(page);
        const numberLimit = Number(limit);
        const skip = (numberPage - 1)*numberLimit;

        if(!Number.isInteger(numberPage) ||
            !Number.isInteger(numberLimit) ||
            numberPage < 1 || numberLimit < 1 || numberLimit > 100){
                return null
            }

        const totalTasks = await Task.countDocuments(filter);

        const task = await Task.find(filter).sort(sort).skip(skip).limit(numberLimit);
        return {
            task,
            pagination:{
                numberPage,
                limit: numberLimit,
                totalTasks,
                totalPages: Math.ceil(totalTasks / numberLimit)
            }
        }
}

export {findTaskByTaskid,
    taskDetailsVerify,
    filterTheTasks
};