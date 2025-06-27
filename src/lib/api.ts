import axios from 'axios';
import type { Equipment, UserProfile } from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  if (typeof window !== 'undefined' && data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

export async function signup(name: string, email: string, password: string) {
  const { data } = await api.post('/auth/signup', { name, email, password });
  if (typeof window !== 'undefined' && data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}

export async function getEquipmentList() {
  const { data } = await api.get<Equipment[]>('/equipment');
  return data;
}

export async function saveEquipment(equipment: Omit<Equipment, 'id' | 'userId'>, id?: string) {
  if (id) {
    await api.put(`/equipment/${id}`, equipment);
  } else {
    await api.post('/equipment', equipment);
  }
}

export async function deleteEquipment(id: string) {
  await api.delete(`/equipment/${id}`);
}

export async function getProfile() {
  const { data } = await api.get<UserProfile>('/users/me');
  return data;
}

export async function updateProfile(profile: Partial<UserProfile>) {
  const { data } = await api.put<UserProfile>('/users/me', profile);
  return data;
}
