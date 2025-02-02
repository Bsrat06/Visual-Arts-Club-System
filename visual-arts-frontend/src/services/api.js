import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

// Create an Axios instance with authentication headers
const API = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

export default API;
