const Task = require("../models/Task");
const Project = require("../models/Project");
// const Workspace = require("../models/Workspace");

const { setCache, setETag } = require("../services/cache");

// Create a task
exports.createTask = async (req, res, next) => {
  try {
    const { name, description, status, projectId, assignedTo, dueDate } =
      req.body;

    const project = await Project.findById(projectId).populate(
      "workspace",
      "-projects"
    );
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (
      !project.workspace.owner.equals(req.user.id)
      // && !project.workspace.members.includes(req.user.id)
    )
      return res.status(403).json({
        message: "You are not authorized to create a task in this project",
      });

    const task = await Task.create({
      name,
      description,
      status,
      project: projectId,
      assignedTo,
      dueDate,
      createdBy: req.user.id,
    });

    project.tasks.push(task._id);
    await project.save();

    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId).populate({
      path: "project",
      select: "workspace",
      populate: {
        path: "workspace",
        select: "owner members",
        model: "Workspace",
      },
    });
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (
      !task.project.workspace.owner.equals(req.user.id) &&
      !task.project.workspace.members.includes(req.user.id)
    )
      return res
        .status(403)
        .json({ message: "You are not authorized to access this task" });

    // Cache the task data in Redis
    await setCache("task", task._id, task);

    // Set ETag for response
    const etag = await setETag(task);
    res.setHeader("ETag", etag);

    // console.log("get task controller");

    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { name, description, status, projectId, assignedTo, dueDate } =
      req.body;

    const task = await Task.findById(req.params.taskId).populate({
      path: "project",
      select: "workspace",
      populate: {
        path: "workspace",
        select: "owner",
        model: "Workspace",
      },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.project.workspace.owner.equals(req.user.id))
      return res
        .status(403)
        .json({ message: "You are not authorized to update this task" });

    task.name = name;
    task.description = description;
    task.status = status;
    task.project = projectId;
    task.assignedTo = assignedTo;
    task.dueDate = dueDate;
    await task.save();
    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId).populate({
      path: "project",
      select: "workspace tasks",
      populate: {
        path: "workspace",
        select: "owner",
        model: "Workspace",
      },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.project.workspace.owner.equals(req.user.id))
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this task" });

    task.project.tasks.pull(task._id);
    await task.project.save();
    await task.deleteOne();

    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};
