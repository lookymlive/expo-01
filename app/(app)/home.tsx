import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../context/auth';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>¡Hola, {user?.email}!</Text>
      <Text style={styles.text}>Bienvenido a tu app</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});