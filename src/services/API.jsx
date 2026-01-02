// api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://vcxtv1pq-5000.inc1.devtunnels.ms';

// 👉 Default token (jo tu ne diya):
const DEFAULT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTRlNmMwNDg4ZDFmZTc1Nzc5NDE3MGQiLCJpYXQiOjE3NjcxNjM4MzcsImV4cCI6MTc2Nzc2ODYzN30.rvZsvOuRCZJDh9EP--SytopDfKaPlEgd4LBSs_pFOlw";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});


api.interceptors.request.use(async (config) => {
  const storedToken = await AsyncStorage.getItem("_TOKEN");
  const tokenToUse = DEFAULT_TOKEN

  if (DEFAULT_TOKEN) {
    config.headers.Authorization = `Bearer ${DEFAULT_TOKEN}`;
  }


  
  return config;
});

export default api;
