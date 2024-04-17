import express from "express";
import { loginUser, registerUser  ,getUserdetails , editUser} from "../controller/user.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/userDetails/:userId",getUserdetails)
router.put("/updateuser/:userId",editUser)
export default router;
