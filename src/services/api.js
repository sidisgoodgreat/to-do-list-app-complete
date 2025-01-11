// src/services/api.js
import axios from 'axios';

const API_URL = 'https://677a9e66671ca030683469a3.mockapi.io/todo/createTodo';

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      params: { email: credentials.email }
    });
    const user = response.data.find(u => u.password === credentials.password);
    return user || null;
  } catch (error) {
    throw error;
  }
};
