import { api } from './client'
import type { EPIRequestPayload, EPIResponse } from '@/lib/types'

export async function getAllEquipment() {
  const { data } = await api.get<EPIResponse[]>('/epi')
  return data
}

export async function saveEquipmentAdmin(
  equipment: EPIRequestPayload,
  id?: string,
) {
  if (id) {
    const { data } = await api.put<EPIResponse>(`/epi/${id}`, equipment)
    return data
  } else {
    const { data } = await api.post<EPIResponse>('/epi', equipment)
    return data
  }
}

export async function deleteEquipmentAdmin(id: string) {
  await api.delete(`/epi/${id}`)
}

export async function uploadEquipmentPhoto(id: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  await api.post(`/upload/epis/${id}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export async function triggerAlerts() {
  await api.post('/admin/alerts/trigger')
}
