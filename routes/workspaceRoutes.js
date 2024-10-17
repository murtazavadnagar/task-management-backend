const express = require("express");
const {
  createWorkspace,
  getWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addUserToWorkspace,
} = require("../controllers/workspaceController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Protected routes
router.post("/", protect, createWorkspace);
router.get("/", protect, getWorkspaces);
router.get("/:workspaceId", protect, getWorkspace);
router.put("/:workspaceId", protect, updateWorkspace);
router.delete("/:workspaceId", protect, deleteWorkspace);
router.put("/:workspaceId/add-user", protect, addUserToWorkspace);

module.exports = router;
