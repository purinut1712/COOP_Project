import axios from 'axios';

const api = axios.create({
  baseURL: 'http://20.24.17.205/api' // ห้ามมี / ปิดท้าย
});