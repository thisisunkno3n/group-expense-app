import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

export const addTransaction = async (groupId, transaction) => {
  try {
    const transactionData = {
      ...transaction,
      groupId,
      createdAt: new Date().toISOString(),
    };
    
    const docRef = await addDoc(collection(db, 'transactions'), transactionData);
    return { id: docRef.id, ...transactionData };
  } catch (error) {
    throw error;
  }
};

export const getTransactionsByGroup = async (groupId) => {
  try {
    const q = query(
      collection(db, 'transactions'),
      where('groupId', '==', groupId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const transactions = [];
    
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });
    
    return transactions;
  } catch (error) {
    throw error;
  }
};

export const calculateBalances = (transactions, members) => {
  // Initialize balances for each member
  const balances = {};
  members.forEach(member => {
    balances[member] = 0;
  });
  
  // Calculate net balance for each member
  transactions.forEach(transaction => {
    const { paidBy, totalAmount, splits } = transaction;
    
    // Add the total amount to the payer
    balances[paidBy] += totalAmount;
    
    // Subtract each person's share
    Object.entries(splits).forEach(([userId, amount]) => {
      balances[userId] -= amount;
    });
  });
  
  // Calculate who owes whom
  const debts = [];
  const creditors = Object.entries(balances)
    .filter(([_, balance]) => balance > 0)
    .sort((a, b) => b[1] - a[1]);
  
  const debtors = Object.entries(balances)
    .filter(([_, balance]) => balance < 0)
    .sort((a, b) => a[1] - b[1]);
  
  let i = 0, j = 0;
  
  while (i < debtors.length && j < creditors.length) {
    const [debtorId, debtorBalance] = debtors[i];
    const [creditorId, creditorBalance] = creditors[j];
    
    const amount = Math.min(Math.abs(debtorBalance), creditorBalance);
    
    if (amount > 0) {
      debts.push({
        from: debtorId,
        to: creditorId,
        amount
      });
    }
    
    debtors[i][1] += amount;
    creditors[j][1] -= amount;
    
    if (Math.abs(debtors[i][1]) < 0.01) i++;
    if (creditors[j][1] < 0.01) j++;
  }
  
  return debts;
}; 