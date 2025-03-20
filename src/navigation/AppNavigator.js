import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';

// Import screens
import GroupsListScreen from '../screens/GroupScreens/GroupsListScreen';
import GroupDetailsScreen from '../screens/GroupScreens/GroupDetailsScreen';
import CreateGroupScreen from '../screens/GroupScreens/CreateGroupScreen';
import AddTransactionScreen from '../screens/TransactionScreens/AddTransactionScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const GroupStack = createStackNavigator();

const GroupStackNavigator = () => {
  return (
    <GroupStack.Navigator>
      <GroupStack.Screen name="GroupsList" component={GroupsListScreen} options={{ title: 'My Groups' }} />
      <GroupStack.Screen name="GroupDetails" component={GroupDetailsScreen} options={({ route }) => ({ title: route.params?.groupName || 'Group Details' })} />
      <GroupStack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ title: 'Create Group' }} />
      <GroupStack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ title: 'Add Expense' }} />
    </GroupStack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Groups') {
            iconName = 'users';
          } else if (route.name === 'Settings') {
            iconName = 'cog';
          }

          return <Icon type="font-awesome" name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Groups" 
        component={GroupStackNavigator} 
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator; 