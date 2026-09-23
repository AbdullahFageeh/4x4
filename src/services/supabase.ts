import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase credentials not configured.\n' +
    'Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.\n' +
    'Demo mode active — auth and real-time features will use mock data.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: (key: string) => SecureStore.getItemAsync(key),
      setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
      removeItem: (key: string) => SecureStore.deleteItemAsync(key),
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Auth helpers
export const signInWithPhone = async (phone: string, password: string) => {
  if (!isSupabaseConfigured()) {
    // Demo mode — simulate auth
    return {
      data: {
        user: {
          id: 'demo-user-001',
          phone,
          user_metadata: { name: 'عبدالله' },
        },
        session: { access_token: 'demo-token' },
      },
      error: null,
    };
  }
  return supabase.auth.signInWithPassword({ phone, password });
};

export const signUpWithPhone = async (phone: string, password: string, name: string) => {
  if (!isSupabaseConfigured()) {
    return {
      data: {
        user: {
          id: 'demo-user-001',
          phone,
          user_metadata: { name },
        },
        session: { access_token: 'demo-token' },
      },
      error: null,
    };
  }
  return supabase.auth.signUp({
    phone,
    password,
    options: { data: { name } },
  });
};

export const signOut = async () => {
  if (!isSupabaseConfigured()) {
    return { error: null };
  }
  return supabase.auth.signOut();
};

export const getSession = async () => {
  if (!isSupabaseConfigured()) {
    return { data: { session: null }, error: null };
  }
  return supabase.auth.getSession();
};

export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  if (!isSupabaseConfigured()) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
  return supabase.auth.onAuthStateChange(callback);
};
