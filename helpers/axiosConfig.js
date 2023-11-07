import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://44e0-2800-e2-7b80-f95-dadf-9cdd-5f93-64e6.ngrok-free.app/api',
});

export default instance;