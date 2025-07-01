export enum EquipmentType {
  HELMET = 'HELMET',
  ROPE = 'ROPE',
  HARNESS = 'HARNESS',
  SLING = 'SLING',
  CARABINER = 'CARABINER',
  DESCENDER = 'DESCENDER',
  QUICKDRAW = "QUICKDRAW",
  OTHER = 'OTHER',
}

// Mapping « constante → libellé français »
export const EquipmentTypeLabels: Record<EquipmentType, string> = {
  [EquipmentType.HELMET]: 'Casque',
  [EquipmentType.ROPE]: 'Corde',
  [EquipmentType.HARNESS]: 'Baudrier',
  [EquipmentType.SLING]: 'Sangle',
  [EquipmentType.CARABINER]: 'Mousqueton',
  [EquipmentType.DESCENDER]: 'Descendeur',
  [EquipmentType.QUICKDRAW]: 'Degaine',
  [EquipmentType.OTHER]: 'Autre',
};

export enum EquipmentStatus {
  GOOD = 'GOOD',
  EXPIRING_SOON = 'EXPIRING_SOON',
  EXPIRED = 'EXPIRED',
  ARCHIVED = 'ARCHIVED',
}

export interface Equipment {
  id: string;
  name: string;
  // …
  status: EquipmentStatus;
  percentageUsed: number;
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  serialNumber?: string;
  purchaseDate: Date;        // ISO date
  serviceStartDate: Date;    // ISO date
  expectedEndOfLife: Date;   // ISO date
  description: string;
  manufacturerData?: string;
  photoUrl: string;
  photoAiHint?: string;
  archived: boolean;
  // ISO date
  // status, percentageUsed si nécessaire
}

export interface UserProfile {
  name: string;
  email: string;
  /** Percentage of lifespan used before showing alerts */
  alertThreshold?: number;
}
