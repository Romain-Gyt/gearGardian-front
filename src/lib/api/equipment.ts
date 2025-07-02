// api.ts (client)
import { api } from './client';
import type { EPIRequestPayload, EPI} from '@/lib/types';


// Récupère la liste des équipements de l'utilisateur authentifié
export async function getEquipmentList() {
  const { data } = await api.get<EPI[]>('/epi/me');
  return data;
}

// Crée ou met à jour un équipement
export async function saveEquipment(
    equipment: EPIRequestPayload,  // on envoie exactement le payload attendu
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
