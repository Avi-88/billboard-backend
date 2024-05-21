import express from "express";

import {
  addPost,
  editPost,
  getUserPosts,
  removePost,
  getAllPosts,
  buyPost,
  getPostById,
} from "../controller/post.js";
import { tokenBucketLimiter } from "../middleware/token-bucket.js";
import { rateLimiter } from "../middleware/fixed-window.js";
import { leakyBucket } from "../middleware/leaky-bucket.js";
const router = express.Router();

router.post("/newPost", tokenBucketLimiter, addPost);
router.get("/userPosts", getUserPosts);
router.post("/buyPost", buyPost);
router.get("/allPosts", getAllPosts);
router.get("/:id", getPostById);
router.put("/editPost", editPost);
router.delete("/removePost", removePost);

export default router;
