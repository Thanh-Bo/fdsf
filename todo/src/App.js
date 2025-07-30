import React, {useState , useEffect} from "react";
import './App.css';
import axios from 'axios';

const App = () => { 
  const [taskInput , setTaskInput] = useState('');
  const [category, setCategory] = useState('Important');
  const [tasks, setTasks] = useState([]);
  useEffect (() => {
    axios.get('http://localhost:5000/api/tasks')
      .then((res) => setTasks(res.data))
      .catch((err) => console.log("Error fetching tasks ", err));

  },[]) ;// the role of this function
  const handleAddTask = () => {
    const trimmedTask = taskInput.trim();
    if (trimmedTask === ''){
      console.log('Task cannot be empty');
      return ;
    }
    if (tasks.some((task) => task.text === trimmedTask)){
      console.log('Task already exists!');
    }
    const newTask = {text : trimmedTask , category};
    axios.post('http://localhost:5000/api/tasks', newTask)
      .then((res) => {
        setTasks([...tasks, res.data]);
        setTaskInput('');
      })
      .catch((err) => console.log('Error adding tasks', err));

  };
  const handleRemoveTask = (id) => {
    axios.delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));

      })
      .catch((err) => console.log('Error removing task', err));
  };
  const handleCompleteTask = (id, completed) => {
    axios 
      .put(`http://localhost:5000/api/tasks/${id}`, {completed : !completed})
      .then((res) => {
        const updatedTask = tasks.map((task) =>
          task._id === id ? {...task ,completed : res.data.completed} : task
        );
        setTasks(updatedTask);
      })
      .catch((err) => console.log('Error updating task completion', err));

  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter'){
      handleAddTask();
    }
  };
  const handleRemoveAll = () => {
    axios
      .delete('http://localhost:5000/api/tasks')
      .then(() => setTasks([]))
      .catch((err) => console.log('Error removing all tasks', err));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-lg w-full p-10">
        <div className="text-3xl text-blue-500 font-bold text-center m-5">
          To Do List
        </div>
        <div className="flex">
          <input 
            type = 'text'
            value = {taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyUp={handleKeyPress}
            placeholder="What shit you need to do today ? "
            className="flex-1 rounded-lg px-4 py-2 bg-gray-100"
          />
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
          >
            Add
          </button>
        </div>
        <div className="m-3">
          <h1>Category:</h1>
          <select 
            id = 'category'
            value = {category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-100 m-2"
          >
            <option value="Important">Important</option>
            <option value="High Priority">High Priority</option>
            <option value="Medium Priority">Medium Priority</option>
            <option value="Low Priority">Low Priority</option>
            <option value="Very Low Priority">Very Low Priority</option>
            <option value="Optional">Optional</option>
          </select>
        </div>
        <ul >
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li key = {task._id} 
                  className="bg-gray-100 rounded-lg flex items-center justify-between p-3 m-2"
              >
                <input
                  type = 'checkbox'
                  checked = {task.completed}
                  onChange={() => handleCompleteTask(task._id , task.completed)}
                  className="mr-2"
                />
                <span 
                  className={`text-blue-500 font-bold ${
                    task.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {task.category} - {task.text}
                </span>
                <button 
                  onClick={() => handleRemoveTask(task._id)}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2"
                >
                  Remove
                </button>
              </li>
            ))
          ) : (
            <h3 className="text-center text-gray-400 uppercase">
              You isn't add some shit to get thing done today. Loser!
            </h3>
          )}
        </ul>
        <div className="text-center m-4">
          <button 
            onClick={handleRemoveAll}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
          >
            Remove All Tasks
          </button>
        </div>
      </div>
    </div>
  );
};
export default App;
