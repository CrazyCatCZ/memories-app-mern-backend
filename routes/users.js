import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  getAllUsers,
  getUser,
  registerUser,
  loginUser,
  getInfo,
  verifyToken,
} from "../controllers/users.js";

const router = express.Router();

/*
router.get("/", getAllUsers);
router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/info", authMiddleware, getInfo);
router.get("/checkUser", authMiddleware);
*/

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/info", authMiddleware, getInfo);
router.get("/checkUser", verifyToken);

export default router;
