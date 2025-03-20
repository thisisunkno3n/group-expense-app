import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { createGroup } from '../../services/groupService';
import { getCurrentUser } from '../../services/authService';

const CreateGroupScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    try {
      setLoading(true);
      const user = getCurrentUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Parse members from comma-separated string to array
      const memberEmails = members.split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);
      
      // For now, we'll just use the emails as IDs
      // In a real app, you'd need to look up user IDs from emails
      
      await createGroup(groupName, user.uid, memberEmails);
      
      Alert.alert('Success', 'Group created successfully', [
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
      <Text h4 style={styles.title}>Create a New Group</Text>
      
      <Input
        placeholder="Group Name (e.g., Trip to Bali)"
        value={groupName}
        onChangeText={setGroupName}
        leftIcon={{ type: 'font-awesome', name: 'users' }}
      />
      
      <Input
        placeholder="Member Emails (comma-separated)"
        value={members}
        onChangeText={setMembers}
        multiline
        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
        inputContainerStyle={styles.membersInput}
        helpText="Enter email addresses separated by commas"
      />
      
      <Button
        title="Create Group"
        onPress={handleCreateGroup}
        loading={loading}
        containerStyle={styles.buttonContainer}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  membersInput: {
    height: 100,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default CreateGroupScreen; 