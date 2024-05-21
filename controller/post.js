import {
  createPost,
  fetchUserPosts,
  deletePost,
  updatePost,
  postTransaction,
  fetchALLPosts,
  fetchPostById,
} from "../utils/postCRUD.js";
import { Success, Error } from "../utils/responseModels.js";

export const addPost = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      category,
      size
    } = req.body;

    const rating = Number(req.body.rating);
    const userId = Number(req.body.userId);
    const price_per_day = Number(req.body.price_per_day);

    const payload = {
      title,
      description,
      userId,
      rating,
      location,
      category,
      size,
      price_per_day,
    };

    const result = await createPost(payload);

    res.status(201).json(new Success("Post was added Successfully", result));
  } catch (error) {
    console.log(error);
    res.status(500).json(new Error("Failed to add post"));
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;

    let postList = await fetchALLPosts(searchTerm);

    res
      .status(200)
      .json(new Success("Successfully fetched all posts", postList));
  } catch (error) {
    console.log(error);
    res.status(500).json(new Error("Failed to fetch posts"));
  }
};

export const getPostById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    let postInfo = await fetchPostById(id);

    res
      .status(200)
      .json(new Success("Successfully fetched all posts", postInfo));
  } catch (error) {
    console.log(error);
    res.status(500).json(new Error("Failed to fetch posts"));
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userId = Number(req.query.userId);
    const role = req.query.role;

    let userPostList = await fetchUserPosts(userId, role);

    res
      .status(200)
      .json(new Success("Successfully fetched user posts", userPostList));
  } catch (error) {
    console.log(error);
    res.status(500).json(new Error("Failed to fetch posts for the given user"));
  }
};

export const editPost = async (req, res) => {
  try {
    const { postId, userId, payload } = req.body;

    const post = await fetchPostById(postId);

    if (post.ownerId != userId) {
      throw "Unauthorized user trying to edit post";
    }

    const updatedPost = await updatePost(postId, payload);

    res
      .status(200)
      .json(new Success("Successfully updated given post", updatedPost));
  } catch (error) {
    console.log(error);
    res.status(500).json(new Error("Failed to edit given post"));
  }
};

export const buyPost = async (req, res) => {
  try {
    const responseObj = await postTransaction(req.body);
    res
      .status(200)
      .json(new Success("Successfully bought given post", responseObj));
  } catch (error) {
    console.log(error);
    res.status(500).json(new Error("Failed to buy given post"));
  }
};

export const removePost = async (req, res) => {
  try {
    const { postId, userId } = req.body;

    const post = await fetchPostById(postId);

    if (post.ownerId != userId) {
      throw "Unauthorized user trying to delete post";
    }

    let deletedPost = await deletePost(postId);

    res
      .status(200)
      .json(new Success("Successfully deleted given post", deletedPost));
  } catch (error) {
    console.log(error);
    res.status(500).json(new Error("Failed to delete given post"));
  }
};
