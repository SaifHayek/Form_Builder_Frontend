import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bayt-task-gamma.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
