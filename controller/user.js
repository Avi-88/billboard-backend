import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../utils/prismaClient.js";
import { Error, Success } from "../utils/responseModels.js";

import { fetchUserById, updateUser } from "../utils/userCRUD.js";
dotenv.config();

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const registerUser = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;
    let user_model;
    switch (role) {
      case "seller":
        user_model = prisma.seller;
        break;
      default:
        user_model = prisma.user;
        break;
    }
    const hashedPassword = await hashPassword(password);

    const result = await user_model.create({
      data: {
        userName,
        email,
        password: hashedPassword,
      },
    });
    delete result?.password;

    res.status(201).json(new Success("User registered successfully", result));
  } catch (error) {
    console.log(error);
    res.status(500).json(new Error("Failed to register user"));
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user_model;
    switch (role) {
      case "seller":
        user_model = prisma.seller;
        break;
      default:
        user_model = prisma.user;
        break;
    }

    const user = await user_model.findFirst({
      where: { email: String(email) },
    });

    if (!user) {
      res.status(404).json(new Error("User doesn't exist"));
      return;
    }

    const comparison = await bcrypt.compare(password, user.password);
    if (!comparison) {
      res.status(401).json(new Error("Incorrect password"));
      return;
    }

    delete user?.password;

    res.status(200).json(new Success("Successfully logged in user", user));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new Error("Failed to authenticate user"));
  }
};

export const getUserdetails = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const role = req.params.role;

    let user_model;
    switch (role) {
      case "seller":
        user_model = prisma.seller;
        break;
      default:
        user_model = prisma.user;
        break;
    }
    let user = await fetchUserById(userId, user_model);
    res.status(200).json(new Success("Successfully fetched", user));
  } catch (error) {
    console.log(error);
    res.status(500).json(new Error("Failed to fetch user"));
  }
};

export const editUser = async (req, res) => {
  const userId = Number(req.params.userId); // Assuming user ID is passed as a route parameter
  const newDetails = req.body; // Assuming new details are passed in the request body

  let user_model;
  switch (role) {
    case "seller":
      user_model = prisma.seller;
      break;
    default:
      user_model = prisma.user;
      break;
  }

  try {
    const updatedUser = await updateUser(userId, newDetails, user_model);
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};
