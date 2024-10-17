const Workspace = require("../models/Workspace");

// Create Workspace
exports.createWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.create({
      name: req.body.name,
      owner: req.user.id,
    });

    res.status(201).json({ workspace });
  } catch (error) {
    next(error);
  }
};

exports.getWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    });
    if (!workspaces)
      return res.status(404).json({ message: "Workspaces not found" });

    res.status(200).json({ workspaces });
  } catch (error) {
    next(error);
  }
};

exports.getWorkspace = async (req, res, next) => {
  try {
    // // Use this query to fetch document only if user is a member or owner of the workspace
    // const workspace = await Workspace.find({
    //   _id: req.params.workspaceId,
    //   $or: [{ owner: req.user.id }, { members: req.user.id }],
    // });

    // Use this query to fetch document first and then check for authorization of the user
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    if (
      !workspace.members.includes(req.user.id) &&
      !workspace.owner.equals(req.user.id)
    )
      return res
        .status(403)
        .json({ message: "You are not authorized to access this workspace" });

    res.status(200).json({ workspace });
  } catch (error) {
    next(error);
  }
};

exports.updateWorkspace = async (req, res, next) => {
  try {
    const { name } = req.body;
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    if (
      !workspace.members.includes(req.user.id) &&
      !workspace.owner.equals(req.user.id)
    )
      return res
        .status(403)
        .json({ message: "You are not authorized to update this workspace" });

    workspace.name = name;
    await workspace.save();

    res.status(200).json({ workspace });
  } catch (error) {
    next(error);
  }
};

exports.deleteWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });
    if (!workspace.owner.equals(req.user.id))
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this workspace" });

    await workspace.deleteOne();
    return res.status(200).json({ workspace });
  } catch (error) {
    next(error);
  }
};

exports.addUserToWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    if (!workspace.owner.equals(req.user.id))
      return res.status(403).json({
        message: "You are not authorized to add user to this workspace",
      });

    workspace.members.push(req.body.userId);
    await workspace.save();

    res.status(200).json({ workspace });
  } catch (error) {
    next(error);
  }
};
