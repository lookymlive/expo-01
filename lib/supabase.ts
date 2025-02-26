// Add polyfill at the very top to ensure window is defined
if (typeof window === 'undefined') {
  (global as any).window = globalThis;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Custom storage implementation
const customStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        return window.localStorage.getItem(key);
      }
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.error('Error getting item from storage:', e);
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (e) {
      console.error('Error setting item in storage:', e);
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {
      console.error('Error removing item from storage:', e);
    }
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL and Anon Key must be defined in environment variables!'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
