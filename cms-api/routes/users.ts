import express from "express";
import { user_detail, user_list } from "../controllers/userController";

const router = express.Router();

router.get("/", user_list);

router.get("/:id", user_detail);

export default router;
