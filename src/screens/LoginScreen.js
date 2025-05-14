import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    try {
      const data = await login(email, password);
      if (data && data.token) {
        await AsyncStorage.setItem('userToken', data.token);
        navigation.replace('Home');
      } else {
        Alert.alert('Login Failed', 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Login Error', error.message || 'An error occurred during login');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password recovery flow to be implemented.');
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-6 text-center">Login</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-3 mb-4"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="border border-gray-300 rounded-md p-3 mb-6"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        className="bg-blue-600 rounded-md py-3 mb-4"
        onPress={handleLogin}
      >
        <Text className="text-white text-center font-semibold">Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text className="text-blue-600 text-center">Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}
