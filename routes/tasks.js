const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const router = express.Router();

// Get all tasks for user
router.get("/", auth, async (req, res) => {
  await connectDB();
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create task
router.post("/", auth, async (req, res) => {
  await connectDB();
  try {
    const task = new Task({
      text: req.body.text,
      user: req.userId,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update task
router.put("/:id", auth, async (req, res) => {
  await connectDB();
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true },
    );
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete task
router.delete("/:id", auth, async (req, res) => {
  await connectDB();
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
