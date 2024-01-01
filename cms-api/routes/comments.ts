import express from "express";
import {
  comment_list,
  comment_detail,
  comment_create_post,
  comment_delete_post,
} from "../controllers/commentController";

const router = express.Router();

router.get("/", comment_list);

router.get("/:id", comment_detail);

router.get("/create", comment_create_post);

router.get("/delete", comment_delete_post);

export default router;
