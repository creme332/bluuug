import express from "express";
import { login_post } from "../controllers/authController";

const router = express.Router();

router.post("/login", login_post);

export default router;
