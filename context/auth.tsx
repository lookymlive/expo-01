import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

type UserRole = 'business' | 'user';

type User = {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  businessName?: string;
  businessDescription?: string;
} | null;

type AuthContextType = {
  user: User;
  signInWithGoogle: (role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  updateBusinessProfile: (data: {
    businessName: string;
    businessDescription: string;
  }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  updateBusinessProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    webClientId: GOOGLE_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          loadUserProfile(session.user.id);
        }
      });

      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          loadUserProfile(session.user.id);
        } else {
          setUser(null);
        }
      });
    } catch (error) {
      console.error('Authentication initialization error:', error);
      // Optionally, render fallback UI or redirect as needed.
    }
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select(
          `
          *,
          business_profiles (*)
        `
        )
        .eq('user_id', userId)
        .single();

      if (profile) {
        setUser({
          id: profile.user_id,
          email: profile.email,
          displayName: profile.username,
          photoURL: profile.avatar_url,
          role: profile.role,
          businessName: profile.business_profiles?.[0]?.name,
          businessDescription: profile.business_profiles?.[0]?.description,
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Optionally, render fallback UI or redirect as needed.
    }
  };

  useEffect(() => {
    if (response?.type === 'success' && selectedRole) {
      const { authentication } = response;
      if (authentication?.accessToken) {
        handleGoogleSignIn(authentication.accessToken, selectedRole);
      }
    }
  }, [response, selectedRole]);

  const handleGoogleSignIn = async (accessToken: string, role: UserRole) => {
    try {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: accessToken,
      });

      if (error) throw error;

      if (data.user) {
        // Create or update profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: data.user.id,
            email: data.user.email,
            username: data.user.user_metadata.full_name,
            avatar_url: data.user.user_metadata.avatar_url,
            role,
          })
          .select()
          .single();

        if (profileError) throw profileError;

        if (role === 'business') {
          // Create initial business profile if it doesn't exist
          const { error: businessError } = await supabase
            .from('business_profiles')
            .upsert({
              profile_id: profile.id,
              name: 'Mi Negocio',
              description: 'Descripción de mi negocio',
            });

          if (businessError) throw businessError;
        }

        await loadUserProfile(data.user.id);
      }
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === 'business') {
        router.replace('/(app)/business/profile');
      } else {
        router.replace('/(app)/feed');
      }
    }
  }, [user]);

  const signInWithGoogle = async (role: UserRole) => {
    try {
      setSelectedRole(role);
      await promptAsync();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSelectedRole(null);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error during sign out:', error);
      // Optionally, render fallback UI or redirect as needed.
    }
  };

  const updateBusinessProfile = async (data: {
    businessName: string;
    businessDescription: string;
  }) => {
    if (user && user.role === 'business') {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          const { error } = await supabase
            .from('business_profiles')
            .update({
              name: data.businessName,
              description: data.businessDescription,
            })
            .eq('profile_id', profile.id);

          if (error) throw error;

          setUser({
            ...user,
            businessName: data.businessName,
            businessDescription: data.businessDescription,
          });
        }
      } catch (error) {
        console.error('Error updating business profile:', error);
        throw error;
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, signInWithGoogle, signOut, updateBusinessProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
