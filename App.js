import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MyRecipesScreen from './src/screens/MyRecipesScreen';
import RecipeCreateScreen from './src/screens/RecipeCreateScreen';
import RecipeEditScreen from './src/screens/RecipeEditScreen';
import ServerSelectionScreen from './src/screens/ServerSelectionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkServerUrl = async () => {
      const serverUrl = await AsyncStorage.getItem('serverUrl');
      if (serverUrl) {
        setInitialRoute('Login');
      } else {
        setInitialRoute('ServerSelection');
      }
    };
    checkServerUrl();
  }, []);

  if (!initialRoute) {
    // Optionally, render a loading screen or null while checking
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{headerShown: false}}>
        <Stack.Screen name="ServerSelection" component={ServerSelectionScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MyRecipes" component={MyRecipesScreen} />
        <Stack.Screen name="RecipeCreate" component={RecipeCreateScreen} />
        <Stack.Screen name="RecipeEdit" component={RecipeEditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
