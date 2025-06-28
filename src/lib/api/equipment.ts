import { api } from './client';
import type { Equipment } from '@/lib/types';

export async function getEquipmentList() {
  const { data } = await api.get<Equipment[]>('/equipment');
  return data;
}

export async function saveEquipment(
  equipment: Omit<Equipment, 'id' | 'userId' | 'status' | 'percentageUsed'>,
  id?: string,
) {
  if (id) {
    await api.put(`/equipment/${id}`, equipment);
  } else {
    await api.post('/equipment', equipment);
  }
}

export async function deleteEquipment(id: string) {
  await api.delete(`/equipment/${id}`);
}
