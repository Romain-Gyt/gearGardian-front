import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, Timestamp, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import type { Equipment } from './types';
import { EquipmentType } from './types';

// This file contains client-side functions to interact with Firestore.
// It assumes that the user's authentication status (and UID) is handled
// in the component calling these functions.

// Security can be further enhanced by setting up Firestore Security Rules
// in the Firebase console to ensure users can only access their own data.
// Example rule for the 'equipment' collection:
//
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /equipment/{equipmentId} {
//       allow read, write, delete: if request.auth != null && request.auth.uid == resource.data.userId;
//     }
//     match /users/{userId} {
//       allow read, update: if request.auth != null && request.auth.uid == userId;
//       allow create: if request.auth != null;
//     }
//   }
// }


// Type guard to check if a string is a valid EquipmentType
function isEquipmentType(value: any): value is EquipmentType {
    return Object.values(EquipmentType).includes(value);
}

const equipmentCollection = collection(db, 'equipment');

export async function getEquipmentList(userId: string): Promise<Equipment[]> {
    const q = query(equipmentCollection, where("userId", "==", userId), orderBy('serviceStartDate', 'desc'));
    const snapshot = await getDocs(q);
    const equipmentList: Equipment[] = [];
    snapshot.forEach(doc => {
        const data = doc.data();
        
        if (data.name && isEquipmentType(data.type) && data.purchaseDate && data.serviceStartDate && data.expectedEndOfLife) {
             equipmentList.push({
                id: doc.id,
                userId: data.userId,
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

export async function saveEquipment(equipmentData: Omit<Equipment, 'id' | 'userId'>, userId: string, id?: string): Promise<void> {
    const dataToSave = {
        ...equipmentData,
        userId,
    };

    if (id) {
        const equipmentDoc = doc(db, 'equipment', id);
        // Firestore automatically converts Date objects to Timestamps on write
        await updateDoc(equipmentDoc, dataToSave);
    } else {
        await addDoc(equipmentCollection, dataToSave);
    }
}

export async function deleteEquipment(id: string): Promise<void> {
    const equipmentDoc = doc(db, 'equipment', id);
    await deleteDoc(equipmentDoc);
}
