import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, Button, ListItem, Icon, Divider } from 'react-native-elements';
import { getGroupById } from '../../services/groupService';
import { getTransactionsByGroup, calculateBalances } from '../../services/transactionService';
import { getCurrentUser } from '../../services/authService';

const GroupDetailsScreen = ({ route, navigation }) => {
  const { groupId } = route.params;
  const [group, setGroup] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const groupData = await getGroupById(groupId);
        setGroup(groupData);
        
        const transactionsData = await getTransactionsByGroup(groupId);
        setTransactions(transactionsData);
        
        const calculatedBalances = calculateBalances(transactionsData, groupData.members);
        setBalances(calculatedBalances);
      } catch (error) {
        console.error('Error fetching group data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
    
    // Refresh when the screen is focused
    const unsubscribe = navigation.addListener('focus', fetchGroupData);
    return unsubscribe;
  }, [groupId, navigation]);

  const renderTransactionItem = ({ item }) => (
    <ListItem bottomDivider>
      <Icon name={getCategoryIcon(item.category)} type="font-awesome" />
      <ListItem.Content>
        <ListItem.Title>{item.description}</ListItem.Title>
        <ListItem.Subtitle>
          {`Paid by ${item.paidByName} • ${new Date(item.createdAt).toLocaleDateString()}`}
        </ListItem.Subtitle>
      </ListItem.Content>
      <Text style={styles.amount}>${item.totalAmount.toFixed(2)}</Text>
    </ListItem>
  );

  const renderBalanceItem = ({ item }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title style={styles.balanceText}>
          {`${item.from} owes ${item.to}`}
        </ListItem.Title>
      </ListItem.Content>
      <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
    </ListItem>
  );

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'food': return 'cutlery';
      case 'transportation': return 'car';
      case 'entertainment': return 'film';
      case 'accommodation': return 'home';
      default: return 'money';
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text h4>{group.name}</Text>
        <Text>{group.members.length} members</Text>
      </View>
      
      <View style={styles.section}>
        <Text h4 style={styles.sectionTitle}>Balances</Text>
        {balances.length === 0 ? (
          <Text style={styles.emptyText}>No balances to settle</Text>
        ) : (
          <FlatList
            data={balances}
            renderItem={renderBalanceItem}
            keyExtractor={(item, index) => `balance-${index}`}
            scrollEnabled={false}
          />
        )}
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.section}>
        <Text h4 style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.length === 0 ? (
          <Text style={styles.emptyText}>No transactions yet</Text>
        ) : (
          <FlatList
            data={transactions}
            renderItem={renderTransactionItem}
            keyExtractor={item => item.id}
            style={styles.transactionsList}
          />
        )}
      </View>
      
      <Button
        title="Add Expense"
        icon={<Icon name="plus" type="font-awesome" color="white" style={{ marginRight: 10 }} />}
        buttonStyle={styles.addButton}
        containerStyle={styles.buttonContainer}
        onPress={() => navigation.navigate('AddTransaction', { groupId, members: group.members })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  divider: {
    marginVertical: 10,
  },
  transactionsList: {
    maxHeight: 300,
  },
  amount: {
    fontWeight: 'bold',
  },
  balanceText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    color: 'gray',
  },
  addButton: {
    backgroundColor: '#2089dc',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 30,
  },
});

export default GroupDetailsScreen; 