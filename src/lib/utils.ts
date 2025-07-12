import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { EquipmentStatus, EPI } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function deriveStatus(equipment: EPI): EquipmentStatus {
  if (equipment.archived) {
    return EquipmentStatus.ARCHIVED;
  }
  if (equipment.percentageUsed >= 100) {
    return EquipmentStatus.EXPIRED;
  }

  // tu peux extraire ce seuil si tu veux le rendre configurable
  const EXPIRING_SOON_THRESHOLD = 80;
  if (equipment.percentageUsed >= EXPIRING_SOON_THRESHOLD) {
    return EquipmentStatus.EXPIRING_SOON;
  }
  return EquipmentStatus.GOOD;
}

