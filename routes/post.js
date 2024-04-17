import express from "express";

import {
  addPost,
  editPost,
  getUserPosts,
  removePost,
  getAllPosts,
  buyPost
} from "../controller/post.js";

const router = express.Router();

router.post("/newPost", addPost);
router.get("/userPosts", getUserPosts);
router.post("/buyPost", buyPost);
router.get("/allPosts",getAllPosts);
router.put(
  "/editPost",
  editPost
);
router.delete(
  "/removePost",
  removePost
);

export default router;
