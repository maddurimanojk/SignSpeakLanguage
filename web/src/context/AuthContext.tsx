import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, TranslationRecord, UserSettings } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (fullName: string, email: string) => void;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  userHistory: TranslationRecord[];
  addTranslationRecord: (record: Omit<TranslationRecord, 'id' | 'userId'>) => Promise<TranslationRecord>;
  deleteTranslationRecord: (id: string) => Promise<void>;
  clearUserHistory: () => Promise<void>;
}

const defaultSettings: UserSettings = {
  speechRate: 1.0,
  speechPitch: 1.0,
  speechVolume: 1.0,
  confidenceThreshold: 0.75,
  backendUrl: import.meta.env.VITE_API_URL || 'https://signspeak-ai-api.onrender.com',
  autoSpeak: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [userHistory, setUserHistory] = useState<TranslationRecord[]>([]);

  useEffect(() => {
    const savedSettings = localStorage.getItem('signspeak_user_settings');
    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch (e) {}
    }

    if (isSupabaseConfigured() && supabase) {
      // Supabase Auth session listener
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const u: User = {
            id: session.user.id,
            fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            createdAt: session.user.created_at,
          };
          setUser(u);
          loadSupabaseHistory(u.id);
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const u: User = {
            id: session.user.id,
            fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            createdAt: session.user.created_at,
          };
          setUser(u);
          loadSupabaseHistory(u.id);
        } else {
          setUser(null);
          setUserHistory([]);
        }
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Local session token check (No raw passwords stored)
      const savedSessionUser = localStorage.getItem('signspeak_session_user');
      if (savedSessionUser) {
        try {
          const parsed: User = JSON.parse(savedSessionUser);
          setUser(parsed);
          loadLocalHistory(parsed.id);
        } catch (e) {
          localStorage.removeItem('signspeak_session_user');
        }
      }
      setIsLoading(false);
    }
  }, []);

  const loadSupabaseHistory = async (userId: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (data && !error) {
        const mapped: TranslationRecord[] = data.map((item: any) => ({
          id: item.id,
          userId: item.user_id,
          dateTime: item.created_at,
          sentence: item.translation,
          confidence: item.confidence,
          durationSeconds: item.metadata?.duration || 10,
          signCount: item.metadata?.sign_count || item.translation.split(' ').length,
          status: 'Completed',
        }));
        setUserHistory(mapped);
      }
    } catch (e) {
      console.error('Supabase load history error:', e);
    }
  };

  const loadLocalHistory = (userId: string) => {
    const raw = localStorage.getItem('signspeak_history_records') || '[]';
    try {
      const all: TranslationRecord[] = JSON.parse(raw);
      setUserHistory(all.filter((r) => r.userId === userId));
    } catch (e) {
      setUserHistory([]);
    }
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });

      setIsLoading(false);
      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const sessionUser: User = {
          id: data.user.id,
          fullName: data.user.user_metadata?.full_name || email.split('@')[0],
          email: data.user.email || email,
          createdAt: data.user.created_at,
        };
        setUser(sessionUser);
        loadSupabaseHistory(sessionUser.id);
        return { success: true };
      }
      return { success: false, error: 'Sign in failed.' };
    } else {
      // Local authentication without storing plain passwords
      const usersRaw = localStorage.getItem('signspeak_users_db') || '[]';
      const users: (User & { passwordHash: string })[] = JSON.parse(usersRaw);
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!found) {
        setIsLoading(false);
        return { success: false, error: 'No account found with this email.' };
      }

      if (found.passwordHash !== btoa(pass)) {
        setIsLoading(false);
        return { success: false, error: 'Incorrect password.' };
      }

      const sessionUser: User = {
        id: found.id,
        fullName: found.fullName,
        email: found.email,
        createdAt: found.createdAt,
      };

      setUser(sessionUser);
      localStorage.setItem('signspeak_session_user', JSON.stringify(sessionUser));
      loadLocalHistory(sessionUser.id);
      setIsLoading(false);
      return { success: true };
    }
  };

  const signup = async (fullName: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: pass,
        options: {
          data: { full_name: fullName.trim() },
        },
      });

      setIsLoading(false);
      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const sessionUser: User = {
          id: data.user.id,
          fullName: fullName.trim(),
          email: email.trim(),
          createdAt: data.user.created_at,
        };
        setUser(sessionUser);
        return { success: true };
      }
      return { success: false, error: 'Sign up failed.' };
    } else {
      const usersRaw = localStorage.getItem('signspeak_users_db') || '[]';
      const users: (User & { passwordHash: string })[] = JSON.parse(usersRaw);

      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        setIsLoading(false);
        return { success: false, error: 'Account already exists with this email.' };
      }

      const newUser = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: btoa(pass),
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem('signspeak_users_db', JSON.stringify(users));

      const sessionUser: User = {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        createdAt: newUser.createdAt,
      };

      setUser(sessionUser);
      localStorage.setItem('signspeak_session_user', JSON.stringify(sessionUser));
      loadLocalHistory(sessionUser.id);
      setIsLoading(false);
      return { success: true };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setUserHistory([]);
    localStorage.removeItem('signspeak_session_user');
  };

  const updateProfile = (fullName: string, email: string) => {
    if (!user) return;
    const updated = { ...user, fullName, email };
    setUser(updated);
    if (!isSupabaseConfigured()) {
      localStorage.setItem('signspeak_session_user', JSON.stringify(updated));
    }
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('signspeak_user_settings', JSON.stringify(updated));
  };

  const addTranslationRecord = async (record: Omit<TranslationRecord, 'id' | 'userId'>): Promise<TranslationRecord> => {
    if (!user) {
      throw new Error('Must be logged in to save history');
    }

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('translations')
        .insert({
          user_id: user.id,
          translation: record.sentence,
          confidence: record.confidence,
          language: 'ISL',
          metadata: { duration: record.durationSeconds, sign_count: record.signCount },
        })
        .select()
        .single();

      if (data && !error) {
        const newRecord: TranslationRecord = {
          id: data.id,
          userId: data.user_id,
          dateTime: data.created_at,
          sentence: data.translation,
          confidence: data.confidence,
          durationSeconds: record.durationSeconds,
          signCount: record.signCount,
          status: 'Completed',
        };
        setUserHistory((prev) => [newRecord, ...prev]);
        return newRecord;
      }
    }

    const newRecord: TranslationRecord = {
      ...record,
      id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      userId: user.id,
    };

    const raw = localStorage.getItem('signspeak_history_records') || '[]';
    const all: TranslationRecord[] = JSON.parse(raw);
    const updatedAll = [newRecord, ...all];
    localStorage.setItem('signspeak_history_records', JSON.stringify(updatedAll));

    setUserHistory((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const deleteTranslationRecord = async (id: string) => {
    if (!user) return;
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('translations').delete().eq('id', id).eq('user_id', user.id);
    }
    const raw = localStorage.getItem('signspeak_history_records') || '[]';
    const all: TranslationRecord[] = JSON.parse(raw);
    localStorage.setItem('signspeak_history_records', JSON.stringify(all.filter((r) => r.id !== id)));
    setUserHistory((prev) => prev.filter((r) => r.id !== id));
  };

  const clearUserHistory = async () => {
    if (!user) return;
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('translations').delete().eq('user_id', user.id);
    }
    const raw = localStorage.getItem('signspeak_history_records') || '[]';
    const all: TranslationRecord[] = JSON.parse(raw);
    localStorage.setItem('signspeak_history_records', JSON.stringify(all.filter((r) => r.userId !== user.id)));
    setUserHistory([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        settings,
        updateSettings,
        userHistory,
        addTranslationRecord,
        deleteTranslationRecord,
        clearUserHistory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
