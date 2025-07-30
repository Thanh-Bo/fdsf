// api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000';  // Backend API URL

// Function to get tasks
export const getTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

// Function to add a task
export const addTask = async (task) => {
  try {
    const response = await axios.post(`${API_URL}/tasks`, task);
    return response.data;
  } catch (error) {
    console.error('Error adding task:', error);
  }
};
