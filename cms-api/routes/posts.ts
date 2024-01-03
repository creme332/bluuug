import express from "express";
import {
  post_detail,
  post_list,
  post_create_post,
  post_delete_post,
} from "../controllers/postController";

const router = express.Router();

router.get("/", post_list);

router.get("/:id", post_detail);

router.post("/create", post_create_post);

router.post("/:id/delete", post_delete_post);

export default router;
