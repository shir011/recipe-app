import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { createRecipe } from '../services/api';

export default function RecipeCreateScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');
  const [fechaCreacion, setFechaCreacion] = useState('');
  const [tipoId, setTipoId] = useState('');
  const [porciones, setPorciones] = useState('');
  const [ingredientes, setIngredientes] = useState([{ nombre: '', cantidad: '' }]);
  const [pasos, setPasos] = useState([{ orden: 1, descripcion: '' }]);

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
      const response = await createRecipe(recipeData);
      Alert.alert('Éxito', response.mensaje || 'Receta creada correctamente y enviada para validación');
      navigation.goBack();
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          Alert.alert('Error', data.error || 'Faltan campos obligatorios');
        } else if (status === 403) {
          Alert.alert('Error', data.error || 'Acción no autorizada para su rol');
        } else if (status === 422) {
          Alert.alert('Error', data.error || 'Categoría inválida');
        } else if (status === 409) {
          Alert.alert('Error', data.error || 'Ya existe una receta con ese nombre. ¿Desea reemplazarla?');
        } else {
          Alert.alert('Error', data.error || 'Error interno al guardar la receta');
        }
      } else {
        Alert.alert('Error', 'Error de red o servidor');
      }
    }
  };

  return (
    <ScrollView className="bg-white p-4">
      <Text className="text-xl font-bold mb-4">Crear Nueva Receta</Text>

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
        <Text className="text-white text-center font-semibold">Guardar Receta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
