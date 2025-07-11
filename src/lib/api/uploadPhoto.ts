import { api } from './client';

/** Upload a photo for the given EPI */
export async function uploadPhoto(epiId: number | string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post(`/epi/${epiId}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/** Replace an existing EPI photo */
export async function replacePhoto(epiId: number | string, photoId: number | string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.put(`/epi/${epiId}/photos/${photoId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
