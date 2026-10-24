import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';
import { getOrCreateUserProfile, updateUserWallet, initializeDatabaseIfEmpty } from '../services/storeService';

export const AUTHORIZED_ADMIN_EMAIL = 'abdulahad.onr2@gmail.com';

export interface AppUser {
  uid: string;
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

export type User = AppUser;

interface AuthContextType {
  user: AppUser | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<AppUser | null>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  deductWalletBalance: (amount: number) => Promise<boolean>;
  addWalletBalance: (amount: number) => Promise<void>;
  adminSessionVerified: boolean;
  verifyAdminPasscode: (code: string) => boolean;
  revokeAdminSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(su: any): AppUser {
  return {
    uid: su.id,
    id: su.id,
    email: su.email || null,
    displayName:
      su.user_metadata?.full_name ||
      su.user_metadata?.name ||
      su.user_metadata?.displayName ||
      su.email?.split('@')[0] ||
      'Customer',
    photoURL: su.user_metadata?.avatar_url || su.user_metadata?.picture || undefined,
  };
}

function mapFirebaseUser(fu: FirebaseUser): AppUser {
  return {
    uid: fu.uid,
    id: fu.uid,
    email: fu.email,
    displayName: fu.displayName || fu.email?.split('@')[0] || 'Customer',
    photoURL: fu.photoURL || undefined,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Strictly enforce admin access only if logged in as AUTHORIZED_ADMIN_EMAIL
  const [adminSessionVerified, setAdminSessionVerified] = useState<boolean>(false);

  const verifyAdminPasscode = (_code: string): boolean => {
    // Only the authorized admin email gets admin access
    return false;
  };

  const revokeAdminSession = () => {
    setAdminSessionVerified(false);
  };

  const syncProfile = async (authUser: AppUser | null) => {
    if (!authUser) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const isOwnerAdmin =
      Boolean(authUser.email && authUser.email.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase());

    try {
      const p = await getOrCreateUserProfile({
        uid: authUser.uid,
        email: authUser.email,
        displayName: authUser.displayName,
        photoURL: authUser.photoURL,
      });
      if (p) {
        // Enforce role strictly: only the designated email can ever be admin
        p.role = isOwnerAdmin ? 'admin' : 'customer';

        const bal = Number(p.walletBalance);
        if (bal === 850 || bal === 800 || (p.walletBalance as any) === '850' || (p.walletBalance as any) === '800') {
          p.walletBalance = 0;
        }
      }
      setProfile(p);
    } catch (err) {
      console.warn('Profile sync fallback:', err);
      setProfile({
        uid: authUser.uid,
        email: authUser.email || '',
        displayName: authUser.displayName || 'Gamer',
        photoURL: authUser.photoURL || undefined,
        walletBalance: 0,
        role: isOwnerAdmin ? 'admin' : 'customer',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // 1. Check existing Supabase session on startup
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!isMounted) return;
        if (session?.user) {
          const mapped = mapSupabaseUser(session.user);
          setUser(mapped);
          syncProfile(mapped);
          if (mapped.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
            initializeDatabaseIfEmpty().catch(() => {});
          }
        }
      })
      .catch((err) => {
        console.warn('Initial Supabase session fetch notice:', err);
      });

    // 2. Subscribe to Supabase Auth state changes (OAuth signInWithOAuth redirect / login)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        const mapped = mapSupabaseUser(session.user);
        setUser(mapped);
        await syncProfile(mapped);
        if (mapped.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
          initializeDatabaseIfEmpty().catch(() => {});
        }
      } else {
        // Fallback: check Firebase user if present
        const fbUser = auth.currentUser;
        if (fbUser) {
          const mapped = mapFirebaseUser(fbUser);
          setUser(mapped);
          await syncProfile(mapped);
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    });

    // 3. Fallback: Listen to Firebase Auth state
    const unsubscribeFb = onAuthStateChanged(auth, async (fbUser) => {
      if (!isMounted) return;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        if (fbUser) {
          const mapped = mapFirebaseUser(fbUser);
          setUser(mapped);
          await syncProfile(mapped);
          if (mapped.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
            initializeDatabaseIfEmpty().catch(() => {});
          }
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      unsubscribeFb();
    };
  }, []);

  const loginWithGoogle = async (): Promise<AppUser | null> => {
    try {
      // Connect the Google Sign-In button to Supabase Auth using signInWithOAuth with provider google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error('Supabase signInWithOAuth error:', error);
        alert('Supabase Google Sign-In Error: ' + error.message);
        return null;
      }

      // If URL returned and running in iframe, open popup window; otherwise redirect
      if (data?.url) {
        if (typeof window !== 'undefined' && window.self !== window.top) {
          window.open(data.url, '_blank', 'width=520,height=650');
        } else if (typeof window !== 'undefined') {
          window.location.href = data.url;
        }
      }

      return null;
    } catch (err: any) {
      console.warn('Supabase Google Auth error:', err);
      return null;
    }
  };

  const logout = async () => {
    revokeAdminSession();
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signout warning:', e);
    }
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Firebase signout warning:', e);
    }
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await syncProfile(user);
    }
  };

  const deductWalletBalance = async (amount: number): Promise<boolean> => {
    const currentBal = profile?.walletBalance ?? 0;
    if (currentBal < amount) return false;
    const newBal = currentBal - amount;
    if (user) {
      try {
        await updateUserWallet(user.uid, newBal);
      } catch (err) {
        console.warn('Remote wallet update error:', err);
      }
    }
    setProfile((prev) => (prev ? { ...prev, walletBalance: newBal } : null));
    return true;
  };

  const addWalletBalance = async (amount: number): Promise<void> => {
    const currentBal = profile?.walletBalance ?? 0;
    const newBal = currentBal + amount;
    if (user) {
      try {
        await updateUserWallet(user.uid, newBal);
      } catch (err) {
        console.warn('Remote wallet update error:', err);
      }
    }
    setProfile((prev) => (prev ? { ...prev, walletBalance: newBal } : null));
  };

  // Restrict admin access strictly and exclusively to the selected admin email
  const isAdmin = Boolean(
    user?.email && user.email.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        loading,
        loginWithGoogle,
        logout,
        refreshProfile,
        deductWalletBalance,
        addWalletBalance,
        adminSessionVerified,
        verifyAdminPasscode,
        revokeAdminSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
