import express from "express";
import { login_post } from "../controllers/authController";

const router = express.Router();

router.post("/login", login_post);

// router.get("/logout", comment_detail);

// router.post("/reset-password", comment_create_post);

export default router;
