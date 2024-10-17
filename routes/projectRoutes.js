const express = require("express");
const {
  createProject,
  getProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

// Protected routes
router.post("/", protect, createProject);
router.get("/:projectId", protect, getProject);
router.put("/:projectId", protect, updateProject);
router.delete("/:projectId", protect, deleteProject);

module.exports = router;
