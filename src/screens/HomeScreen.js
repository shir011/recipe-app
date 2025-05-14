import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Login');
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold mb-6">Welcome to Recipe App</Text>
      <TouchableOpacity
        className="bg-blue-600 rounded-md py-3 px-6 mb-4"
        onPress={() => navigation.navigate('MyRecipes')}
      >
        <Text className="text-white font-semibold">Mis Recetas</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-red-600 rounded-md py-3 px-6"
        onPress={handleLogout}
      >
        <Text className="text-white font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
