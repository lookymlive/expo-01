import { Session } from '@supabase/supabase-js';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  signInWithGoogle: (role?: 'user' | 'business') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Get the appropriate client ID based on platform
const getClientId = () => {
  switch (Platform.OS) {
    case 'ios':
      return process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
    case 'android':
      return process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
    default:
      return process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: getClientId(),
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleSignInWithGoogle(authentication?.accessToken);
    }
  }, [response]);

  const handleSignInWithGoogle = async (accessToken?: string) => {
    if (!accessToken) return;

    try {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: accessToken,
      });

      if (error) throw error;
      setSession(data.session);

      // Navigate based on user role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', data.session?.user.id)
        .single();

      if (profile?.role === 'business') {
        router.replace('/(business)/upload-video');
      } else {
        router.replace('/(app)/feed');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const signInWithGoogle = async (role?: 'user' | 'business') => {
    try {
      const result = await promptAsync();
      if (result.type === 'success') {
        // Store the role preference for after authentication
        if (role) {
          await supabase.auth.setSession({
            access_token: result.authentication?.accessToken || '',
            refresh_token: '',
          });
        }
      }
    } catch (error) {
      console.error('Error initiating Google sign in:', error);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
