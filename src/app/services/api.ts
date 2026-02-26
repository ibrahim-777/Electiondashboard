import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Party Lists API
export const partyListsAPI = {
  getAll: () => api.get('/party-lists'),
  getById: (id: number) => api.get(`/party-lists/${id}`),
  create: (data: any) => api.post('/party-lists', data),
  update: (id: number, data: any) => api.put(`/party-lists/${id}`, data),
  delete: (id: number) => api.delete(`/party-lists/${id}`),
};

// Candidates API
export const candidatesAPI = {
  getAll: () => api.get('/candidates'),
  getById: (id: number) => api.get(`/candidates/${id}`),
  create: (data: any) => api.post('/candidates', data),
  update: (id: number, data: any) => api.put(`/candidates/${id}`, data),
  delete: (id: number) => api.delete(`/candidates/${id}`),
};

// Polling Boxes API
export const pollingBoxesAPI = {
  getAll: () => api.get('/polling-boxes'),
  getById: (id: number) => api.get(`/polling-boxes/${id}`),
  create: (data: any) => api.post('/polling-boxes', data),
  update: (id: number, data: any) => api.put(`/polling-boxes/${id}`, data),
  delete: (id: number) => api.delete(`/polling-boxes/${id}`),
};

// Votes API
export const votesAPI = {
  getAll: () => api.get('/votes'),
  getById: (id: number) => api.get(`/votes/${id}`),
  create: (data: any) => api.post('/votes', data),
  update: (id: number, data: any) => api.put(`/votes/${id}`, data),
  delete: (id: number) => api.delete(`/votes/${id}`),
  getByPollingBox: (pollingBoxId: number) => api.get(`/votes/polling-box/${pollingBoxId}`),
};

// Voters API
export const votersAPI = {
  getAll: () => api.get('/voters'),
  getById: (id: number) => api.get(`/voters/${id}`),
  create: (data: any) => api.post('/voters', data),
  update: (id: number, data: any) => api.put(`/voters/${id}`, data),
  delete: (id: number) => api.delete(`/voters/${id}`),
  updateStatus: (id: number, status: string) => api.patch(`/voters/${id}/status`, { status }),
  markAsElected: (id: number) => api.patch(`/voters/${id}/elected`, { elected: true }),
};

// Mandubin API
export const mandubsAPI = {
  getAll: () => api.get('/mandubs'),
  getById: (id: number) => api.get(`/mandubs/${id}`),
  create: (data: any) => api.post('/mandubs', data),
  update: (id: number, data: any) => api.put(`/mandubs/${id}`, data),
  delete: (id: number) => api.delete(`/mandubs/${id}`),
};

// Cars API
export const carsAPI = {
  getAll: () => api.get('/cars'),
  getById: (id: number) => api.get(`/cars/${id}`),
  create: (data: any) => api.post('/cars', data),
  update: (id: number, data: any) => api.put(`/cars/${id}`, data),
  delete: (id: number) => api.delete(`/cars/${id}`),
  updateAvailability: (id: number, isAvailable: boolean) => api.patch(`/cars/${id}/availability`, { isAvailable }),
  incrementTours: (id: number) => api.patch(`/cars/${id}/increment-tours`),
};

// Accounts API
export const accountsAPI = {
  getAll: () => api.get('/accounts'),
  getById: (id: number) => api.get(`/accounts/${id}`),
  create: (data: any) => api.post('/accounts', data),
  update: (id: number, data: any) => api.put(`/accounts/${id}`, data),
  delete: (id: number) => api.delete(`/accounts/${id}`),
  login: (username: string, password: string) => api.post('/accounts/login', { username, password }),
};

// Results API
export const resultsAPI = {
  getOverview: () => api.get('/results/overview'),
  getByBlock: (block: string) => api.get(`/results/block/${block}`),
  getVoterTurnout: () => api.get('/results/voter-turnout'),
};

export default api;
