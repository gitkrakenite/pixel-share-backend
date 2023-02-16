const express = require("express");

const {
  deletePost,
  fetchPosts,
  createPost,
} = require("../controllers/postController,");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/create", protect, createPost);
router.get("/all", fetchPosts);
// router.get("/mine");
router.delete("/delete/:id", protect, deletePost);

module.exports = router;
