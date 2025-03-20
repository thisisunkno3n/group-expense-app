import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, ListItem, Icon } from 'react-native-elements';
import { logoutUser, getCurrentUser } from '../services/authService';

const SettingsScreen = () => {
  const user = getCurrentUser();
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      // Navigation will be handled by the auth state listener
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.userSection}>
        <Icon
          name="user-circle"
          type="font-awesome"
          size={80}
          color="#2089dc"
        />
        <Text h4 style={styles.userName}>{user?.displayName}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>
      
      <View style={styles.settingsSection}>
        <ListItem bottomDivider>
          <Icon name="bell" type="font-awesome" />
          <ListItem.Content>
            <ListItem.Title>Notifications</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        
        <ListItem bottomDivider>
          <Icon name="lock" type="font-awesome" />
          <ListItem.Content>
            <ListItem.Title>Privacy</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        
        <ListItem bottomDivider>
          <Icon name="question-circle" type="font-awesome" />
          <ListItem.Content>
            <ListItem.Title>Help & Support</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        
        <ListItem bottomDivider>
          <Icon name="info-circle" type="font-awesome" />
          <ListItem.Content>
            <ListItem.Title>About</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>
      
      <Button
        title="Logout"
        icon={<Icon name="sign-out" type="font-awesome" color="white" style={{ marginRight: 10 }} />}
        buttonStyle={styles.logoutButton}
        onPress={handleLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  userSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  userName: {
    marginTop: 10,
  },
  userEmail: {
    color: 'gray',
  },
  settingsSection: {
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
  },
});

export default SettingsScreen; 