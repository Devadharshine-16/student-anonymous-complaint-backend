import express from "express";
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    addReply,
    votePost,
    markPostAsResolved,
    getForumStats
} from "../controllers/forum.controller.js";

const router = express.Router();

// Forum post routes
router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/stats", getForumStats);
router.get("/:id", getPostById);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

// Reply routes
router.post("/:id/replies", addReply);

// Action routes
router.post("/:id/vote", votePost);
router.post("/:id/resolve", markPostAsResolved);

export default router;
