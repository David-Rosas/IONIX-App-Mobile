import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import NewTask from './screens/NewTask';
import TaskScreen from './screens/TaskScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import SearchScreen from './screens/SearchScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import { AuthContext, AuthProvider } from './context/AuthProvider';
import LoginScreen from './screens/Auth/LoginScreen';
import RegisterScreen from './screens/Auth/RegisterScreen';
import * as SecureStore from 'expo-secure-store';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, headerBackTitleVisible: false }}
    >
       <Tab.Screen
        name="Home1"
        component={HomeScreen}
        options={{ title: '' }}
      />
    
      <Stack.Screen
        name="New Task"
        component={NewTask}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="Task Screen"
        component={TaskScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="Profile Screen"
        component={ProfileScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, headerBackTitleVisible: false }}
    >
      <Stack.Screen
        name="Login Screen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register Screen"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
     
     
     
    </Tab.Navigator>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    // check if user is logged in or not.
    // Check SecureStore for the user object/token

    SecureStore.getItemAsync('user')
      .then(userString => {
        if (userString) {
          setUser(JSON.parse(userString));
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  return (
    <>
      {user ? (
        <NavigationContainer>
          <Drawer.Navigator
            initialRouteName="Home"
            screenOptions={{ headerShown: true }}
          >
            <Drawer.Screen name="Tasks" component={HomeStackNavigator} />
            <Drawer.Screen name="Settings" component={SettingsScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      ) : (
        <NavigationContainer>
          <AuthStackNavigator />
        </NavigationContainer>
      )}
    </>
  );
}
