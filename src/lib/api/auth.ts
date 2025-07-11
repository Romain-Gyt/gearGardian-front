import { api } from './client';

// Connexion : envoie les identifiants, reçoit le cookie JWT via Set-Cookie
export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

// Inscription : envoie les infos, reçoit aussi un cookie JWT
export async function signup(username: string, email: string, password: string) {
  const { data } = await api.post('/auth/register', { username, email, password });
  return data;
}

// Déconnexion : supprime le cookie côté backend
export async function logout() {
  await api.post('/auth/logout');
}

export interface AuthMe {
  role: string
}

export async function getCurrentUser() {
  const { data } = await api.get<AuthMe>('/auth/me')
  return data
}
