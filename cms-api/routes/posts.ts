import express from "express";
import { post_detail, post_list } from "../controllers/postController";

const router = express.Router();

router.get("/", post_list);

router.get("/:id", post_detail);

export default router;
