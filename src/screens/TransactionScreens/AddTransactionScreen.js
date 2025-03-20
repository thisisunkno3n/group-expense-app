import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input, Button, Text, ListItem, Icon } from 'react-native-elements';
import { addTransaction } from '../../services/transactionService';
import { getCurrentUser } from '../../services/authService';

const categories = [
  { id: 'food', name: 'Food', icon: 'cutlery' },
  { id: 'transportation', name: 'Transportation', icon: 'car' },
  { id: 'entertainment', name: 'Entertainment', icon: 'film' },
  { id: 'accommodation', name: 'Accommodation', icon: 'home' },
  { id: 'other', name: 'Other', icon: 'money' },
];

const AddTransactionScreen = ({ route, navigation }) => {
  const { groupId, members } = route.params;
  const currentUser = getCurrentUser();
  
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidBy, setPaidBy] = useState(currentUser ? currentUser.uid : '');
  const [paidByName, setPaidByName] = useState(currentUser ? currentUser.displayName : '');
  const [category, setCategory] = useState('other');
  const [splits, setSplits] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Initialize splits with equal amounts
  useState(() => {
    if (members && members.length > 0 && totalAmount) {
      const equalShare = parseFloat(totalAmount) / members.length;
      const initialSplits = {};
      members.forEach(member => {
        initialSplits[member] = equalShare;
      });
      setSplits(initialSplits);
    }
  }, [members, totalAmount]);
  
  const handleSplitChange = (memberId, value) => {
    setSplits(prev => ({
      ...prev,
      [memberId]: parseFloat(value) || 0
    }));
  };
  
  const handleEqualSplit = () => {
    if (!totalAmount || isNaN(parseFloat(totalAmount))) {
      Alert.alert('Error', 'Please enter a valid total amount first');
      return;
    }
    
    const equalShare = parseFloat(totalAmount) / members.length;
    const newSplits = {};
    members.forEach(member => {
      newSplits[member] = equalShare;
    });
    setSplits(newSplits);
  };
  
  const handleAddTransaction = async () => {
    if (!description.trim() || !totalAmount || isNaN(parseFloat(totalAmount))) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    // Validate that splits add up to total
    const totalSplits = Object.values(splits).reduce((sum, amount) => sum + amount, 0);
    if (Math.abs(totalSplits - parseFloat(totalAmount)) > 0.01) {
      Alert.alert('Error', 'The sum of all splits must equal the total amount');
      return;
    }
    
    try {
      setLoading(true);
      
      const transactionData = {
        description,
        totalAmount: parseFloat(totalAmount),
        paidBy,
        paidByName,
        category,
        splits,
        createdAt: new Date().toISOString(),
      };
      
      await addTransaction(groupId, transactionData);
      
      Alert.alert('Success', 'Transaction added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text h4 style={styles.title}>Add New Expense</Text>
      
      <Input
        placeholder="Description (e.g., Dinner at Restaurant)"
        value={description}
        onChangeText={setDescription}
        leftIcon={{ type: 'font-awesome', name: 'pencil' }}
      />
      
      <Input
        placeholder="Total Amount"
        value={totalAmount}
        onChangeText={setTotalAmount}
        keyboardType="numeric"
        leftIcon={{ type: 'font-awesome', name: 'dollar' }}
      />
      
      <Text style={styles.sectionTitle}>Category</Text>
      <ScrollView horizontal style={styles.categoriesContainer}>
        {categories.map(cat => (
          <Button
            key={cat.id}
            title={cat.name}
            icon={{ name: cat.icon, type: 'font-awesome', size: 15 }}
            buttonStyle={[
              styles.categoryButton,
              category === cat.id && styles.selectedCategoryButton
            ]}
            titleStyle={styles.categoryTitle}
            onPress={() => setCategory(cat.id)}
            type="outline"
          />
        ))}
      </ScrollView>
      
      <Text style={styles.sectionTitle}>Paid By</Text>
      <View style={styles.paidByContainer}>
        <Input
          value={paidByName}
          disabled
          leftIcon={{ type: 'font-awesome', name: 'user' }}
          containerStyle={styles.paidByInput}
        />
      </View>
      
      <View style={styles.splitsHeader}>
        <Text style={styles.sectionTitle}>Split Details</Text>
        <Button
          title="Split Equally"
          type="clear"
          onPress={handleEqualSplit}
        />
      </View>
      
      {members.map(member => (
        <ListItem key={member} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{member}</ListItem.Title>
          </ListItem.Content>
          <Input
            value={splits[member]?.toString() || '0'}
            onChangeText={(value) => handleSplitChange(member, value)}
            keyboardType="numeric"
            containerStyle={styles.splitInput}
          />
        </ListItem>
      ))}
      
      <Button
        title="Add Expense"
        onPress={handleAddTransaction}
        loading={loading}
        containerStyle={styles.buttonContainer}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  categoryButton: {
    marginHorizontal: 5,
    paddingHorizontal: 10,
  },
  selectedCategoryButton: {
    backgroundColor: '#e7f3ff',
    borderColor: '#2089dc',
  },
  categoryTitle: {
    fontSize: 12,
    marginLeft: 5,
  },
  paidByContainer: {
    marginBottom: 15,
  },
  paidByInput: {
    width: '100%',
  },
  splitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  splitInput: {
    width: 100,
  },
  buttonContainer: {
    marginVertical: 20,
  },
});

export default AddTransactionScreen; 