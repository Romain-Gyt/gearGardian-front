import { api } from './client';
import type { UserProfile } from '@/lib/types';

export async function getProfile() {
  const { data } = await api.get<UserProfile>('/users/me');
  return data;
}

export async function updateProfile(profile: Partial<UserProfile>) {
  const { data } = await api.put<UserProfile>('/users/me', profile);
  return data;
}
