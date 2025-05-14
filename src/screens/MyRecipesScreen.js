import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { fetchRecipes, deleteRecipe } from '../services/api';

export default function MyRecipesScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      // Assuming backend supports filtering by user recipes
      const data = await fetchRecipes({ myRecipes: true });
      setRecipes(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las recetas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadRecipes();
    });
    return unsubscribe;
  }, [navigation]);

  const confirmDelete = (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que querés eliminar esta receta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => handleDelete(id) },
      ]
    );
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecipe(id);
      Alert.alert('Éxito', 'Receta eliminada correctamente');
      loadRecipes();
    } catch (error) {
      Alert.alert('Error', 'Error interno al eliminar la receta');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('RecipeEdit', { recipeId: item.id })}
      className="p-4 border-b border-gray-300"
    >
      <Text className="text-lg font-semibold">{item.nombre}</Text>
      <Text className="text-gray-600">{item.descripcion}</Text>
      <TouchableOpacity
        onPress={() => confirmDelete(item.id)}
        className="mt-2 bg-red-600 rounded px-3 py-1"
      >
        <Text className="text-white">Eliminar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white p-4">
      <TouchableOpacity
        onPress={() => navigation.navigate('RecipeCreate')}
        className="bg-green-600 rounded-md py-3 px-6 mb-4"
      >
        <Text className="text-white font-semibold text-center">Crear Nueva Receta</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#22c55e" />
      ) : recipes.length === 0 ? (
        <Text>No tienes recetas creadas.</Text>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
