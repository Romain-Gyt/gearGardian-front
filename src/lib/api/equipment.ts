
import { api } from './client';
import type { EPIRequestPayload, EPI} from '@/lib/types';



export async function getEquipmentList(): Promise<EPI[]> {
  const response = await api.get('/epi/me', { withCredentials: true });
  console.log('Fetching equipment list:', response.data);
  return response.data;
}

export async function saveEquipment(payload: EPIRequestPayload, id?: string): Promise<EPI> {
  const response = id
      ? await api.put(`/epi/${id}`, payload, { withCredentials: true })
      : await api.post(`/epi`, payload, { withCredentials: true });
  return response.data;
}


// Supprime un équipement
export async function deleteEquipment(id: string) {
  await api.delete(`/epi/${id}`);
}
