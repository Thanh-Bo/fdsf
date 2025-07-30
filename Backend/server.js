const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS to allow requests from your frontend
app.use(express.json()); // Parse incoming JSON requests

// MongoDB Task Model
const taskSchema = new mongoose.Schema({
  text: String,
  category: String,
  completed: { type: Boolean, default: false }, // New field to track completion
});

const Task = mongoose.model('Task', taskSchema);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todolist', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const { text, category } = req.body;
  const newTask = new Task({ text, category });
  await newTask.save();
  res.status(201).json(newTask);
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.status(200).send('Task removed');
});
// Mark a task as completed
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;  // Expects 'completed' in the request body
  
  const updatedTask = await Task.findByIdAndUpdate(id, { completed }, { new: true });
  res.json(updatedTask);
});

// Remove all tasks
app.delete('/api/tasks', async (req, res) => {
  await Task.deleteMany();  // Deletes all tasks in the collection
  res.status(200).send('All tasks removed');
});

// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
