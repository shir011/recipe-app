import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { fetchRecipes, updateRecipe } from '../services/api';

export default function RecipeEditScreen({ route, navigation }) {
  const { recipeId } = route.params;
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');
  const [fechaCreacion, setFechaCreacion] = useState('');
  const [tipoId, setTipoId] = useState('');
  const [porciones, setPorciones] = useState('');
  const [ingredientes, setIngredientes] = useState([]);
  const [pasos, setPasos] = useState([]);

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const data = await fetchRecipes({ id: recipeId });
        if (data && data.length > 0) {
          const recipe = data[0];
          setNombre(recipe.nombre || '');
          setDescripcion(recipe.descripcion || '');
          setImagen(recipe.imagen || '');
          setFechaCreacion(recipe.fechaCreacion || '');
          setTipoId(recipe.tipoId ? recipe.tipoId.toString() : '');
          setPorciones(recipe.porciones ? recipe.porciones.toString() : '');
          setIngredientes(recipe.ingredientes || []);
          setPasos(recipe.pasos || []);
        } else {
          Alert.alert('Error', 'Receta no encontrada');
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert('Error', 'Error al cargar la receta');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    loadRecipe();
  }, [recipeId, navigation]);

  const handleAddIngrediente = () => {
    setIngredientes([...ingredientes, { nombre: '', cantidad: '' }]);
  };

  const handleIngredienteChange = (index, field, value) => {
    const newIngredientes = [...ingredientes];
    newIngredientes[index][field] = value;
    setIngredientes(newIngredientes);
  };

  const handleAddPaso = () => {
    setPasos([...pasos, { orden: pasos.length + 1, descripcion: '' }]);
  };

  const handlePasoChange = (index, value) => {
    const newPasos = [...pasos];
    newPasos[index].descripcion = value;
    setPasos(newPasos);
  };

  const validateFields = () => {
    if (!nombre.trim() || !descripcion.trim() || !fechaCreacion.trim() || !tipoId.trim() || !porciones.trim()) {
      Alert.alert('Error', 'Por favor complete todos los campos obligatorios.');
      return false;
    }
    if (ingredientes.length === 0 || ingredientes.some(i => !i.nombre.trim() || !i.cantidad.trim())) {
      Alert.alert('Error', 'Debe ingresar al menos un ingrediente con nombre y cantidad.');
      return false;
    }
    if (pasos.length === 0 || pasos.some(p => !p.descripcion.trim())) {
      Alert.alert('Error', 'Debe ingresar al menos un paso de preparación.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    const recipeData = {
      nombre,
      descripcion,
      imagen,
      fechaCreacion,
      tipoId,
      porciones: parseInt(porciones, 10),
      ingredientes,
      pasos,
    };

    try {
      const response = await updateRecipe(recipeId, recipeData);
      Alert.alert('Éxito', response.mensaje || 'Cambios guardados correctamente. La receta fue enviada nuevamente a validación.');
      navigation.goBack();
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          Alert.alert('Error', data.error || 'Error en los datos enviados');
        } else if (status === 403) {
          Alert.alert('Error', data.error || 'No autorizado para modificar esta receta');
        } else if (status === 404) {
          Alert.alert('Error', data.error || 'Receta no encontrada');
        } else {
          Alert.alert('Error', data.error || 'Error interno al guardar los cambios');
        }
      } else {
        Alert.alert('Error', 'Error de red o servidor');
      }
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <ScrollView className="bg-white p-4">
      <Text className="text-xl font-bold mb-4">Editar Receta</Text>

      <Text className="font-semibold">Nombre *</Text>
      <TextInput
        className="border border-gray-400 rounded p-2 mb-4"
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre de la receta"
      />

      <Text className="font-semibold">Descripción *</Text>
      <TextInput
        className="border border-gray-400 rounded p-2 mb-4"
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Descripción"
        multiline
      />

      <Text className="font-semibold">Imagen (URL)</Text>
      <TextInput
        className="border border-gray-400 rounded p-2 mb-4"
        value={imagen}
        onChangeText={setImagen}
        placeholder="URL de la imagen principal"
      />

      <Text className="font-semibold">Fecha de Creación *</Text>
      <TextInput
        className="border border-gray-400 rounded p-2 mb-4"
        value={fechaCreacion}
        onChangeText={setFechaCreacion}
        placeholder="YYYY-MM-DD"
      />

      <Text className="font-semibold">Tipo de Receta (ID) *</Text>
      <TextInput
        className="border border-gray-400 rounded p-2 mb-4"
        value={tipoId}
        onChangeText={setTipoId}
        placeholder="ID del tipo de receta"
      />

      <Text className="font-semibold">Porciones *</Text>
      <TextInput
        className="border border-gray-400 rounded p-2 mb-4"
        value={porciones}
        onChangeText={setPorciones}
        placeholder="Número de porciones"
        keyboardType="numeric"
      />

      <Text className="font-semibold">Ingredientes *</Text>
      {ingredientes.map((ingrediente, index) => (
        <View key={index} className="mb-2">
          <TextInput
            className="border border-gray-400 rounded p-2 mb-1"
            value={ingrediente.nombre}
            onChangeText={(text) => handleIngredienteChange(index, 'nombre', text)}
            placeholder="Nombre del ingrediente"
          />
          <TextInput
            className="border border-gray-400 rounded p-2"
            value={ingrediente.cantidad}
            onChangeText={(text) => handleIngredienteChange(index, 'cantidad', text)}
            placeholder="Cantidad"
          />
        </View>
      ))}
      <TouchableOpacity onPress={handleAddIngrediente} className="bg-blue-600 rounded py-2 px-4 mb-4">
        <Text className="text-white text-center">Agregar Ingrediente</Text>
      </TouchableOpacity>

      <Text className="font-semibold">Pasos de Preparación *</Text>
      {pasos.map((paso, index) => (
        <View key={index} className="mb-2">
          <Text className="mb-1">Paso {index + 1}</Text>
          <TextInput
            className="border border-gray-400 rounded p-2"
            value={paso.descripcion}
            onChangeText={(text) => handlePasoChange(index, text)}
            placeholder="Descripción del paso"
            multiline
          />
        </View>
      ))}
      <TouchableOpacity onPress={handleAddPaso} className="bg-blue-600 rounded py-2 px-4 mb-6">
        <Text className="text-white text-center">Agregar Paso</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSubmit} className="bg-green-600 rounded py-3 px-6 mb-6">
        <Text className="text-white text-center font-semibold">Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
