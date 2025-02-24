import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../../context/auth';
import { useState } from 'react';

export default function BusinessProfileScreen() {
  const { user, updateBusinessProfile, signOut } = useAuth();
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [businessDescription, setBusinessDescription] = useState(user?.businessDescription || '');

  const handleSave = () => {
    updateBusinessProfile({ businessName, businessDescription });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de Negocio</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Nombre del Negocio</Text>
        <TextInput
          style={styles.input}
          value={businessName}
          onChangeText={setBusinessName}
          placeholder="Nombre de tu negocio"
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={businessDescription}
          onChangeText={setBusinessDescription}
          placeholder="Describe tu negocio"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#FF4B4B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#666',
    fontSize: 16,
  },
});