import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './firebase';

export const createGroup = async (groupName, createdBy, members = []) => {
  try {
    // Make sure creator is included in members
    if (!members.includes(createdBy)) {
      members.push(createdBy);
    }
    
    const groupData = {
      name: groupName,
      createdBy,
      members,
      createdAt: new Date().toISOString(),
    };
    
    const docRef = await addDoc(collection(db, 'groups'), groupData);
    return { id: docRef.id, ...groupData };
  } catch (error) {
    throw error;
  }
};

export const getGroups = async (userId) => {
  try {
    const q = query(
      collection(db, 'groups'),
      where('members', 'array-contains', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const groups = [];
    
    querySnapshot.forEach((doc) => {
      groups.push({ id: doc.id, ...doc.data() });
    });
    
    return groups;
  } catch (error) {
    throw error;
  }
};

export const getGroupById = async (groupId) => {
  try {
    const docRef = doc(db, 'groups', groupId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Group not found');
    }
  } catch (error) {
    throw error;
  }
};

export const addMemberToGroup = async (groupId, userId) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, {
      members: arrayUnion(userId)
    });
  } catch (error) {
    throw error;
  }
}; 