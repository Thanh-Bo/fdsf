import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const [taskInput, setTaskInput] = useState('');
  const [category, setCategory] = useState('Important');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/tasks')
      .then((res) => setTasks(res.data))
      .catch((err) => console.log('Error fetching tasks:', err));
  }, []);

  const handleAddTask = () => {
    const trimmedTask = taskInput.trim();

    if (trimmedTask === '') {
      console.log('Task cannot be empty');
      return;
    }

    if (tasks.some((task) => task.text === trimmedTask)) {
      console.log('Task already exists!');
      return;
    }

    const newTask = { text: trimmedTask, category };

    // Send POST request to backend
    axios.post('http://localhost:5000/api/tasks', newTask)
      .then((res) => {
        setTasks([...tasks, res.data]); // Add new task with _id
        setTaskInput('');  // Clear input field
      })  
      .catch((err) => console.log('Error adding task:', err));
  };

  const handleRemoveTask = (id) => {
    // Send DELETE request to backend to remove task
    axios.delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id)); // Remove from state
      })
      .catch((err) => console.log('Error removing task:', err));
  };
  // Toggle task completion (Checkbox click)
  const handleCompleteTask = (id, completed) => {
    axios
      .put(`http://localhost:5000/api/tasks/${id}`, { completed: !completed })
      .then((res) => {
        const updatedTasks = tasks.map((task) =>
          task._id === id ? { ...task, completed: res.data.completed } : task
        );
        setTasks(updatedTasks);
      })
      .catch((err) => console.log('Error updating task completion:', err));
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddTask();
    }
  };
  const handleRemoveAll = () => {
    axios
      .delete('http://localhost:5000/api/tasks')
      .then(() => setTasks([]))
      .catch((err) => console.log('Error removing all tasks:', err));
  };
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='bg-white rounded-lg max-w-lg p-10 w-full'>
        <h1 className='text-3xl text-blue-500 font-bold text-center mb-5'>
          To-Do Shit
        </h1>
        <div className='flex'>
          <input 
            type='text'
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyUp={handleKeyPress}
            placeholder='What shit you need to do today ?'
            className='flex-1 border rounded-lg px-4 py-2 bg-gray-100'
          />
          <button   
            className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg'
            onClick={handleAddTask}
          >
            Add
          </button>
        </div>
        <div className='m-3'>
          <label className='text-black mb-3 block'>
            Category:
          </label>
          <select 
            id='category'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className='w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
          >
            <option value="Important">Important</option>
            <option value="High Priority">High Priority</option>
            <option value="Medium Priority">Medium Priority</option>
            <option value="Low Priority">Low Priority</option>
            <option value="Very Low Priority">Very Low Priority</option>
            <option value="Optional">Optional</option>
          </select>
        </div>
        <ul>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li key={task._id} className='bg-gray-100 rounded-lg flex items-center justify-between p-3 mb-2'>
                <div>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleCompleteTask(task._id, task.completed)}
                    className="mr-2"
                  />
                  <span
                    className={`text-blue-500 font-bold ${
                      task.completed ? 'line-through text-gray-500' : ''
                    }`}
                  >
                    {task.category} - {task.text}
                  </span>
                  
                </div>
                <button 
                  onClick={() => handleRemoveTask(task._id)}  // Use _id to remove task
                  className='bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2'
                >
                  Remove
                </button>
              </li>
            ))
          ) : (
            <h3 className='text-center text-gray-400 uppercase'>
              You not add some shit to get thing done today. Loser!
            </h3>
          )}
        </ul>
        <div className="text-center mt-4">
          <button
            onClick={handleRemoveAll}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
          >
            Remove All Tasks
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
