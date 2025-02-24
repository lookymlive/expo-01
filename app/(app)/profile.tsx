import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../context/auth';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.name}>{user?.displayName}</Text>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
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
  profileInfo: {
    marginBottom: 30,
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});