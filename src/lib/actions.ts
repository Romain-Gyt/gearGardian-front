'use server';

import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, Timestamp, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import type { Equipment } from './types';
import { EquipmentType } from './types';

// We need a server-side type for Firestore data, converting Dates to Timestamps
type FirestoreEquipment = Omit<Equipment, 'id' | 'purchaseDate' | 'serviceStartDate' | 'expectedEndOfLife'> & {
    purchaseDate: Timestamp;
    serviceStartDate: Timestamp;
    expectedEndOfLife: Timestamp;
};

// Type guard to check if a string is a valid EquipmentType
function isEquipmentType(value: any): value is EquipmentType {
    return Object.values(EquipmentType).includes(value);
}

const equipmentCollection = collection(db, 'equipment');

export async function getEquipmentList(): Promise<Equipment[]> {
    const q = query(equipmentCollection, orderBy('serviceStartDate', 'desc'));
    const snapshot = await getDocs(q);
    const equipmentList: Equipment[] = [];
    snapshot.forEach(doc => {
        const data = doc.data();
        
        // Basic validation and type conversion
        if (data.name && isEquipmentType(data.type) && data.purchaseDate && data.serviceStartDate && data.expectedEndOfLife) {
             equipmentList.push({
                id: doc.id,
                name: data.name,
                type: data.type,
                serialNumber: data.serialNumber,
                photoUrl: data.photoUrl,
                photoAiHint: data.photoAiHint,
                description: data.description,
                manufacturerData: data.manufacturerData,
                archived: data.archived,
                purchaseDate: (data.purchaseDate as Timestamp).toDate(),
                serviceStartDate: (data.serviceStartDate as Timestamp).toDate(),
                expectedEndOfLife: (data.expectedEndOfLife as Timestamp).toDate(),
            });
        }
    });
    return equipmentList;
}

export async function saveEquipment(equipment: Omit<Equipment, 'id'>, id?: string): Promise<void> {
    if (id) {
        const equipmentDoc = doc(db, 'equipment', id);
        // Firestore automatically converts Date objects to Timestamps
        await updateDoc(equipmentDoc, { ...equipment });
    } else {
        await addDoc(equipmentCollection, equipment);
    }
}

export async function deleteEquipment(id: string): Promise<void> {
    const equipmentDoc = doc(db, 'equipment', id);
    await deleteDoc(equipmentDoc);
}
