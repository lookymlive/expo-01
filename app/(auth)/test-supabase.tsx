import React, { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function TestSupabase() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error);
        } else {
          setSession(data.session);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={styles.container}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {session ? JSON.stringify(session, null, 2) : 'No session found'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
});
