import { Router } from "express";
import authenticate from "../middlewares/authMiddleware.js";
import workspaceMiddleware from "../middlewares/workspaceMiddleware.js";
import projectController from '../controllers/projectController.js';

const router = Router();

router.post("/workspaces/:id/projects", authenticate, workspaceMiddleware(['owner', 'admin']), projectController.createProject);
router.get("/workspaces/:id", authenticate, workspaceMiddleware(['owner', 'admin', 'member', 'viewer']), projectController.getProjectsByWorkspaceId);
router.get("/workspaces/:id/project/:projectid", authenticate, workspaceMiddleware(['owner', 'admin', 'member', 'viewer']), projectController.getProjectById);
router.patch("/workspaces/:id/project/:projectid", authenticate, workspaceMiddleware(['owner', 'admin']), projectController.updateProject); // projects details
router.delete("/workspaces/:id/project/:projectid", authenticate, workspaceMiddleware(['owner', 'admin']), projectController.deleteProject);
router.get("/my-projects", authenticate, projectController.getProjects);

export default router;