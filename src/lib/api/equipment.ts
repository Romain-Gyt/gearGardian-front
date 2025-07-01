// api.ts (client)
import { api } from './client';
import type { Equipment } from '@/lib/types';

// Récupère la liste des équipements de l'utilisateur authentifié
export async function getEquipmentList() {
  const { data } = await api.get<Equipment[]>('/epi/me');
  return data;
}

// Crée ou met à jour un équipement
export async function saveEquipment(
    equipment: Omit<Equipment, 'id' | 'userId' | 'status' | 'percentageUsed'>,
    id?: string,
) {
  if (id) {
    await api.put(`/epi/${id}`, equipment);
  } else {
    await api.post('/epi/add', equipment);
  }
}

// Supprime un équipement
export async function deleteEquipment(id: string) {
  await api.delete(`/epi/${id}`);
}
