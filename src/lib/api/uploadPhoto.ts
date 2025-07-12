import { api } from './client';
import { validateImageFile } from '@/lib/image-utils';
import {ValidationError} from "@/lib/error";

/** Upload a photo for the given EPI */
export async function uploadPhoto(epiId: number | string, file: File) {
  const isValid = await validateImageFile(file);
  if (!isValid) {
    throw new ValidationError('La photo est trop lourde ou trop grande (max 2 Mo, 2000x2000px).');
  }

  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post(`upload/epis/${epiId}/photos`, formData, {
    withCredentials: true,
  });
  return data;
}
/** Replace an existing EPI photo */
export async function replacePhoto(
    epiId: number | string,
    photoId: number | string,
    file: File
) {
  const isValid = await validateImageFile(file);
  if (!isValid) {
    throw new ValidationError('La photo est trop lourde ou trop grande (max 2 Mo, 2000x2000px).');
  }

  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.put(`/upload/epis/${epiId}/photos/${photoId}`, formData, {
    withCredentials: true,
  });

  return data;
}
