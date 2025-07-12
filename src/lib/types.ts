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

export interface EPI {
  id: string;
  name: string;
  type: EquipmentType;
  serialNumber: string;
  purchaseDate: Date;        // ISO date
  serviceStartDate: Date;    // ISO date
  expectedEndOfLife: Date;
  percentageUsed: number
  description: string;
  manufacturerData?: string;
  photoUrl: string;
  photoAiHint?: string;
  archived: boolean;
  CreatedAt: Date;
  UserId: string
  status: EquipmentStatus;
  photos?: PhotoEpi[];
  // ISO date
  // status, percentageUsed si nécessaire
}

/**
 * Correspond exactement à ce que votre EPIRequest Java attend côté backend.
 */
export interface EPIRequestPayload {
  name: string;
  type: EquipmentType;      
  serialNumber: string;
  purchaseDate: string;       // format YYYY-MM-DD
  serviceStartDate: string;   // idem
  lifespanInYears: number;
  description: string;
  manufacturerData?: string;
  archived: boolean;
}

export interface PhotoEpi {
  id: number;
  filename: string;
  url: string;
  contentType: string;
  size: number;
}

export interface UserProfile {
  name: string;
  email: string;
  /** Percentage of lifespan used before showing alerts */
  alertThreshold?: number;
}
