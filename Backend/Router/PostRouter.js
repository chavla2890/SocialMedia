const express = require("express");
const {createPost, getPost, updatePost, deletePost, likeDislikePost, timeline} = require("../Controller/PostController");


const router = express.Router();

router.post("/", createPost)
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.put("/:id/likeDislikePost", likeDislikePost);
router.get("/:id/timeline", timeline);

module.exports = router;