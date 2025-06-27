export enum EquipmentType {
  HELMET = 'Casque',
  ROPE = 'Corde',
  HARNESS = 'Baudrier',
  QUICKDRAW = 'Dégaine',
  CARABINER = 'Mousqueton',
  BELAY_DEVICE = "Système d'assurage",
  OTHER = 'Autre',
}

export interface Equipment {
  id: string;
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
}
