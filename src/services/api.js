import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TIMEOUT = 10000;

const getApiInstance = async () => {
  const baseURL = await AsyncStorage.getItem('serverUrl');
  if (!baseURL) {
    throw new Error('Server URL not set');
  }
  return axios.create({
    baseURL,
    timeout: TIMEOUT,
  });
};

export const login = async (email, password) => {
  const api = await getApiInstance();
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const fetchRecipes = async (filters) => {
  const api = await getApiInstance();
  const response = await api.get('/recipes', { params: filters });
  return response.data;
};

export const createRecipe = async (recipeData) => {
  const api = await getApiInstance();
  const response = await api.post('/recipes', recipeData);
  return response.data;
};

export const updateRecipe = async (id, recipeData) => {
  const api = await getApiInstance();
  const response = await api.put(`/recipes/${id}`, recipeData);
  return response.data;
};

export const deleteRecipe = async (id) => {
  const api = await getApiInstance();
  const response = await api.delete(`/recipes/${id}`);
  return response.data;
};

// Add other API calls as needed
