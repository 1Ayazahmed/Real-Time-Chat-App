import express from "express";
import { loginUser, verifyUserOtp } from "../controller/user";

const router = express.Router();

router.post("/login",loginUser);
router.post("/verify",verifyUserOtp);




export default router;