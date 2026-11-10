import express from 'express';
import { getMe, userLogin, userRegister } from '../controllers/authController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/getme", authenticate, getMe)

export default router;