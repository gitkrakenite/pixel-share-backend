const express = require("express");
const {
  Register,
  Login,
  getMe,
  updateUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/me", protect, getMe);
router.put("/update", protect, updateUser);

module.exports = router;
