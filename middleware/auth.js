import jwt from "jsonwebtoken";
import prisma from "../utils/prismaClient.js";
import { fetchUserById } from "../utils/userCRUD.js";
import { Error, Success } from "../utils/responseModels.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json(new Error("Unauthorized - Missing Token"));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await fetchUserById(decodedToken.userId);

    if (!user) {
      return res.status(401).json(new Error("Unauthorized - Invalid Token"));
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json(new Error("Internal Server Error"));
  }
};

export const validateUserPermissions = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const postId = Number(req.params.postId);

    if (postId === null || postId === undefined || postId === "") {
      return res.status(404).json(new Error("Invalid postId"));
    }

    if (!token) {
      return res.status(401).json(new Error("Unauthorized - Missing Token"));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json(new Error("Invalid postId"));
    }

    if (post.authorId != decodedToken.userId) {
      return res
        .status(401)
        .json(
          new Error(
            "Unauthorized - users are only allowed to edit their own post"
          )
        );
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json(new Error("Internal Server Error"));
  }
};
