import { Router } from "express";
import authenticate from "../middlewares/authMiddleware.js";
import workspaceMiddleware from "../middlewares/workspaceMiddleware.js";
import taskController from "../controllers/taskController.js";
const router = Router();

router.post("/workspaces/:id/project/:projectid/task", authenticate, workspaceMiddleware(['owner', 'admin']), taskController.createTask);
router.get("/workspaces/:id/project/:projectid/task", authenticate, workspaceMiddleware(['owner', 'admin', 'member', 'viewer']), taskController.getTasksByProject);
router.get("/workspaces/:id/task/:taskid", authenticate, workspaceMiddleware(['owner','admin','member','viewer']), taskController.getTaskByTaskId)
router.patch("/workspaces/:id/task/:taskid", authenticate, workspaceMiddleware(['owner', 'admin']), taskController.updateTask);
router.delete("/workspaces/:id/task/:taskid", authenticate, workspaceMiddleware(['owner', 'admin']), taskController.deleteTask);
router.get("/my-tasks", authenticate, taskController.userGetAssignedTask);


export default router;