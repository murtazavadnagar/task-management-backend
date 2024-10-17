const Project = require("../models/Project");
const Workspace = require("../models/Workspace");

// Create a project
exports.createProject = async (req, res, next) => {
  try {
    const { name, description, workspaceId } = req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    if (!workspace.owner.equals(req.user.id))
      return res.status(403).json({
        message: "You are not authorized to create a project in this workspace",
      });

    const project = await Project.create({
      name,
      description,
      workspace: workspaceId,
      createdBy: req.user.id,
    });

    workspace.projects.push(project._id);
    await workspace.save();

    res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId).populate(
      "workspace", // Populate the workspace field
      "-projects" // Except projects field send every field from the workspace
      // "owner members" // Select only owner and members fields of the workspace
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (
      !project.workspace.owner.equals(req.user.id) &&
      !project.workspace.members.includes(req.user.id)
    )
      return res
        .status(403)
        .json({ message: "You are not authorized to access this project" });

    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await Project.findById(req.params.projectId).populate(
      "workspace",
      "-projects"
    );
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!project.workspace.owner.equals(req.user.id))
      return res
        .status(403)
        .json({ message: "You are not authorized to update this project" });

    project.name = name;
    project.description = description;
    await project.save();

    // // Use this query to fetch document aand update directly
    // const project = await Project.findByIdAndUpdate(
    //   req.params.projectId,
    //   {
    //     name,
    //     description,
    //   },
    //   { new: true }
    // );

    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    // const project = await Project.findByIdAndDelete(req.params.projectId);
    const project = await Project.findById(req.params.projectId).populate(
      "workspace"
    );

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!project.workspace.owner.equals(req.user.id))
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this project" });

    project.workspace.projects.pull(project._id); // Remove project from projects array in the populated workspace documents
    // project.workspace.projects.pop(project._id); // Remove project from projects array in the populated workspace documents
    await project.workspace.save();
    await project.deleteOne();

    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};
