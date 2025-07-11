
import { api } from './client';
import type { EPIRequestPayload, EPI} from '@/lib/types';



export async function getEquipmentList() {
  const { data } = await api.get<EPI[]>('/epi/me');
  return data;
}


export async function saveEquipment(
    equipment: EPIRequestPayload,
    id?: string,
) {
  if (id) {
    // PUT /epi/{id}
    await api.put(`/epi/${id}`, equipment);
  } else {
    // POST /epi
    await api.post('/epi', equipment);
  }
}

// Supprime un équipement
export async function deleteEquipment(id: string) {
  await api.delete(`/epi/${id}`);
}
