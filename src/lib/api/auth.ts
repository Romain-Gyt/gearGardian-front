import { api } from './client';

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
