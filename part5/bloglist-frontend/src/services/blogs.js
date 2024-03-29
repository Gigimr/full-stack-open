import axios from 'axios';

const baseUrl = '/api/blogs';

const config = {
  headers: { Authorization: null },
};

const setToken = (newToken) => {
  config.headers.Authorization = `Bearer ${newToken}`;
};

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

const create = async (newObject) => {
  try {
    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};
const update = async (id, newObject) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}`, newObject, config);
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};
const deleted = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}`, config);
    return response.data;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

export default { getAll, setToken, create, update, deleted };
