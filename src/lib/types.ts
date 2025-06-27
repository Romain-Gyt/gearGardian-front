export enum EquipmentType {
  HELMET = 'Casque',
  ROPE = 'Corde',
  HARNESS = 'Baudrier',
  QUICKDRAW = 'Dégaine',
  CARABINER = 'Mousqueton',
  BELAY_DEVICE = "Système d'assurage",
  OTHER = 'Autre',
}

export enum EquipmentStatus {
  GOOD = 'GOOD',
  EXPIRING_SOON = 'EXPIRING_SOON',
  EXPIRED = 'EXPIRED',
  ARCHIVED = 'ARCHIVED',
}

export interface Equipment {
  id: string;
  userId: string;
  name: string;
  type: EquipmentType;
  serialNumber?: string;
  photoUrl: string;
  photoAiHint: string;
  purchaseDate: Date;
  serviceStartDate: Date;
  expectedEndOfLife: Date;
  description: string;
  manufacturerData: string;
  archived: boolean;
  percentageUsed: number;
  status: EquipmentStatus;
}

export interface UserProfile {
  name: string;
  email: string;
}
