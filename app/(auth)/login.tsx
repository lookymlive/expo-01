import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useAuth } from '../../context/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const { signInWithGoogle } = useAuth();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF4B4B', '#FF9B9B']}
        style={styles.background}
      />
      
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800' }}
        style={styles.heroImage}
      />

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Lookym</Text>
          <Text style={styles.subtitle}>Conecta con negocios locales</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.businessButton]} 
            onPress={() => signInWithGoogle('business')}
          >
            <Ionicons name="business" size={24} color="#FF4B4B" />
            <Text style={[styles.buttonText, styles.businessText]}>Continuar como Negocio</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.userButton]} 
            onPress={() => signInWithGoogle('user')}
          >
            <Ionicons name="person" size={24} color="#4285F4" />
            <Text style={[styles.buttonText, styles.userText]}>Continuar como Usuario</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  heroImage: {
    width: '100%',
    height: '50%',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    paddingBottom: 50,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    marginTop: 8,
    opacity: 0.9,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
      },
    }),
  },
  businessButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF4B4B',
  },
  userButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4285F4',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  businessText: {
    color: '#FF4B4B',
  },
  userText: {
    color: '#4285F4',
  },
});