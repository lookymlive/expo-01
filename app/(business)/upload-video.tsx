import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { getVideoPublicUrl, uploadVideo } from '../../lib/videos';

export default function UploadVideoScreen() {
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [businessName, setBusinessName] = useState('');

  const pickAndUploadVideo = async () => {
    if (!title.trim() || !businessName.trim()) {
      Alert.alert('Error', 'Por favor complete el título y nombre del negocio');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'video/*' });
      if (result.canceled) {
        return;
      }

      setUploading(true);

      // Fetch the file from the given URI and convert to Blob
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();

      // Upload video with metadata
      const videoData = {
        title,
        description,
        business_name: businessName,
      };

      const uploadData = await uploadVideo(
        result.assets[0].name,
        blob,
        videoData
      );
      const publicUrl = getVideoPublicUrl(uploadData.path);
      setVideoUrl(publicUrl);
      Alert.alert('Éxito', 'Video cargado correctamente');

      // Reset form
      setTitle('');
      setDescription('');
      setBusinessName('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo subir el video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Subir Video</Text>

        <TextInput
          style={styles.input}
          placeholder="Título del video *"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descripción (opcional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <TextInput
          style={styles.input}
          placeholder="Nombre del negocio *"
          value={businessName}
          onChangeText={setBusinessName}
        />

        <Button
          title="Seleccionar y subir video"
          onPress={pickAndUploadVideo}
          disabled={uploading}
        />

        {uploading && (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color="#0000ff"
          />
        )}
        {videoUrl && (
          <Text style={styles.urlLabel}>Video disponible en: {videoUrl}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  loader: {
    marginTop: 20,
  },
  urlLabel: {
    marginTop: 20,
    color: 'green',
    textAlign: 'center',
  },
});
