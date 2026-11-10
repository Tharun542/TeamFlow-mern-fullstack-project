import express from 'express';
import authenticate from '../middlewares/authMiddleware.js';
import workspaceController from '../controllers/workspaceController.js';
import workspaceMiddleware from '../middlewares/workspaceMiddleware.js';
const router = express.Router();

router.post("/workspace", authenticate, workspaceController.workspace);
router.get("/workspaces", authenticate, workspaceController.getWorkspace);
router.get("/workspaces/:id", authenticate, workspaceMiddleware(["member", "owner", "viewer", "admin"]), workspaceController.getWorkSpaceById);
router.post("/workspaces/:id/member", authenticate,workspaceMiddleware(["admin", "owner"]), workspaceController.addMemberToWorkspace);
router.patch("/workspaces/:id/member/:memberid/role", authenticate,workspaceMiddleware(['owner']) ,workspaceController.updateMemberRole);
router.delete("/workspaces/:id/member/:memberid", authenticate, workspaceMiddleware(['admin', 'owner']), workspaceController.deleteMemberWorkspace);
router.delete("/workspaces/:id", authenticate, workspaceMiddleware(['owner']), workspaceController.deleteWorkspace);

export default router;