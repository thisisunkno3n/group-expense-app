import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, ListItem, Icon, Text } from 'react-native-elements';
import { getGroups } from '../../services/groupService';
import { getCurrentUser } from '../../services/authService';

const GroupsListScreen = ({ navigation }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const user = getCurrentUser();
        if (user) {
          const fetchedGroups = await getGroups(user.uid);
          setGroups(fetchedGroups);
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();

    // Refresh when the screen is focused
    const unsubscribe = navigation.addListener('focus', fetchGroups);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <ListItem 
      bottomDivider
      onPress={() => navigation.navigate('GroupDetails', { 
        groupId: item.id,
        groupName: item.name
      })}
    >
      <Icon name="users" type="font-awesome" />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{item.members.length} members</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {groups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You don't have any groups yet.</Text>
          <Text style={styles.emptySubText}>Create a group to start tracking expenses!</Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
      
      <Button
        title="Create New Group"
        icon={<Icon name="plus" type="font-awesome" color="white" style={{ marginRight: 10 }} />}
        buttonStyle={styles.createButton}
        containerStyle={styles.buttonContainer}
        onPress={() => navigation.navigate('CreateGroup')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
  },
  createButton: {
    backgroundColor: '#2089dc',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 30,
  },
});

export default GroupsListScreen; 