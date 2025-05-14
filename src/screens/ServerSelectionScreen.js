import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ServerSelectionScreen({ navigation }) {
  const [serverUrl, setServerUrl] = useState('');

  useEffect(() => {
    // Optionally, load previously saved server URL
    const loadServerUrl = async () => {
      const savedUrl = await AsyncStorage.getItem('serverUrl');
      if (savedUrl) {
        setServerUrl(savedUrl);
      }
    };
    loadServerUrl();
  }, []);

  const handleSave = async () => {
    if (!serverUrl) {
      Alert.alert('Error', 'Please enter the server URL');
      return;
    }
    // Basic validation for URL format
    if (!/^https?:\/\/.+/.test(serverUrl)) {
      Alert.alert('Error', 'Please enter a valid URL starting with http:// or https://');
      return;
    }
    await AsyncStorage.setItem('serverUrl', serverUrl);
    navigation.replace('Login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 justify-center px-6 bg-white"
    >
      <Text className="text-3xl font-bold mb-6 text-center">Select Local Server</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-3 mb-6"
        placeholder="Enter local server URL"
        value={serverUrl}
        onChangeText={setServerUrl}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
      />
      <TouchableOpacity
        className="bg-blue-600 rounded-md py-3"
        onPress={handleSave}
      >
        <Text className="text-white text-center font-semibold">Save and Continue</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
