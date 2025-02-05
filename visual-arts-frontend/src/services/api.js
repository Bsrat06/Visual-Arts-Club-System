import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

const API = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

// CRUD for Artworks
export const getArtworks = () => API.get("artwork/");
export const createArtwork = (data) => API.post("artwork/", data);
// export const updateArtwork = (id, data) => API.put(`artwork/${id}/`, data);
export const updateArtwork = async (id, data) => {
  return await API.put(`artwork/${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data", // ✅ Ensure correct content type
    },
  });
};
export const deleteArtwork = (id) => API.delete(`artwork/${id}/`);

// CRUD for Events
export const getEvents = () => API.get("events/");
export const createEvent = (data) => API.post("events/", data);
export const updateEvent = (id, data) => API.put(`events/${id}/`, data);
export const deleteEvent = (id) => API.delete(`events/${id}/`);

// CRUD for Projects
export const getProjects = () => API.get("projects/");
export const createProject = (data) => API.post("projects/", data);
export const updateProject = (id, data) => API.put(`projects/${id}/`, data);
export const deleteProject = (id) => API.delete(`projects/${id}/`);

export default API;
