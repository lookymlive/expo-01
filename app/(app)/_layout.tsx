import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/auth';

export default function AppLayout() {
  const { user } = useAuth();
  const isBusiness = user?.role === 'business';

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {!isBusiness && (
        <Tabs.Screen
          name="feed"
          options={{
            title: 'Para Ti',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
      )}
      
      {isBusiness && (
        <Tabs.Screen
          name="business"
          options={{
            title: 'Mi Negocio',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="business" size={size} color={color} />
            ),
          }}
        />
      )}
      
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}