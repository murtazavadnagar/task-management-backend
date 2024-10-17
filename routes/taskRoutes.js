const express = require("express");
const {
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middlewares/authMiddleware");
const cachingMiddleware = require("../middlewares/cachingMiddleware");
const router = express.Router();

// Protected routes
router.post("/", protect, createTask);
router.get("/:taskId", protect, cachingMiddleware("task", "taskId"), getTask);
router.put("/:taskId", protect, updateTask);
router.delete("/:taskId", protect, deleteTask);

module.exports = router;
