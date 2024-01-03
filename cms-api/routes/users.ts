import express from "express";
import {
  user_create_post,
  user_delete_post,
  user_detail,
  user_list,
} from "../controllers/userController";

const router = express.Router();

router.get("/", user_list);

router.get("/:id", user_detail);

router.post("/create", user_create_post);

router.post("/:id/delete", user_delete_post);

export default router;
