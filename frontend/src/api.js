import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export default api;
=======
export default axios.create({
  baseURL: 'http://20.24.17.205/api'
});
>>>>>>> 20eb1e8582902a5f62ef2500beb4947cc8e94983
