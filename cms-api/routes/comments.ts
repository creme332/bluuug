import express from "express";
import { comment_list, comment_detail } from "../controllers/commentController";

const router = express.Router();

router.get("/", comment_list);

router.get("/:id", comment_detail);

export default router;
