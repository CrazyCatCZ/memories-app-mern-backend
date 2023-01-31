import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  getPosts,
  getPost,
  getPostsBySearch,
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
} from "../controllers/posts.js";

const router = express.Router();

router.get("/search", getPostsBySearch);
router.get("/", getPosts);
router.get("/:id", getPost);

router.post("/", authMiddleware, createPost);
router.patch("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);
router.patch("/:id/likePost", authMiddleware, likePost);
router.post("/:id/commentPost", authMiddleware, commentPost);

/*
router.get("/", getPosts);
router.post("/", createPost);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);
router.patch("/:id/likePost", likePost)
*/

export default router;
