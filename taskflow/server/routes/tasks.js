const router = require('express').Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// All task routes require auth
router.use(protect);

// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const { project, status } = req.query;
    const filter = { owner: req.user._id };
    if (project) filter.project = project;
    if (status) filter.status = status;
    const tasks = await Task.find(filter).populate('project', 'title color').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const task = await Task.create({ title, description, status, priority, dueDate, project, owner: req.user._id });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
