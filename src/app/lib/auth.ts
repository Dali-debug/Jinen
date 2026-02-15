import { supabase } from './supabase';
import { projectId } from '/utils/supabase/info';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'parent' | 'nursery';
}

export const authService = {
  async signUp(email: string, password: string, name: string, userType: 'parent' | 'nursery') {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-36fca577/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, userType }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Sign up failed');
    }

    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getAccessToken() {
    const session = await this.getSession();
    return session?.access_token;
  },
};