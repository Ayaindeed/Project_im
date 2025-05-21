import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const getToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

// Etudiant
export const getEtudiantProfile = () => api.get('/etudiant/profile');
export const updateEtudiantProfile = (data) => api.put('/etudiant/profile', data);
export const getEtudiantCandidatures = () => api.get('/etudiant/candidatures');
export const postulerStage = (data) => api.post('/etudiant/postuler', data);
export const getEtudiantStages = () => api.get('/etudiant/stages');

// Entreprise
export const getEntrepriseProfile = () => api.get('/entreprise/profile');
export const updateEntrepriseProfile = (data) => api.put('/entreprise/profile', data);
export const getEntrepriseStages = () => api.get('/entreprise/stages');
export const createStage = (data) => api.post('/entreprise/stages', data);
export const updateStage = (id, data) => api.put(`/entreprise/stages/${id}`, data);
export const getStageCandidatures = (stageId) => api.get(`/entreprise/stages/${stageId}/candidatures`);
export const traiterCandidature = (data) => api.post('/entreprise/candidatures/traiter', data);

// Admin
export const getAllUsers = () => api.get('/admin/users');
export const toggleUserActivation = (id) => api.put(`/admin/users/${id}/toggle`);
export const getStageStats = () => api.get('/admin/stats');
export const getUserDetails = (id) => api.get(`/admin/users/${id}`);
export const affecterEntreprise = (data) => api.post('/admin/assign-entreprise', data);

// Stages (public/shared)
export const getAllStages = () => api.get('/stages');
export const getStageById = (id) => api.get(`/stages/${id}`);

// Candidatures (admin/entreprise)
export const getAllCandidatures = () => api.get('/candidatures');
export const updateCandidature = (id, data) => api.put(`/candidatures/${id}`, data);

// Tuteurs
export const getTuteurs = () => api.get('/tuteurs');
export const createTuteur = (data) => api.post('/tuteurs', data);
export const updateTuteur = (id, data) => api.put(`/tuteurs/${id}`, data);
export const deleteTuteur = (id) => api.delete(`/tuteurs/${id}`);