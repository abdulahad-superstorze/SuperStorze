import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { UserProfile } from '../types';
import { getOrCreateUserProfile, updateUserWallet, initializeDatabaseIfEmpty } from '../services/storeService';

export const AUTHORIZED_ADMIN_EMAIL = 'abdulahad.onr2@gmail.com';
const ADMIN_MASTER_PASSCODES = ['superstorez2026', 'admin786', 'superadmin@2026'];

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  deductWalletBalance: (amount: number) => Promise<boolean>;
  addWalletBalance: (amount: number) => Promise<void>;
  adminSessionVerified: boolean;
  verifyAdminPasscode: (code: string) => boolean;
  revokeAdminSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Secure session verification (Persisted in localStorage so you stay logged in automatically)
  const [adminSessionVerified, setAdminSessionVerified] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ssbd_admin_token') === 'verified_session';
    } catch {
      return false;
    }
  });

  const verifyAdminPasscode = (code: string): boolean => {
    const clean = code.trim().toLowerCase();
    if (ADMIN_MASTER_PASSCODES.includes(clean)) {
      setAdminSessionVerified(true);
      try {
        localStorage.setItem('ssbd_admin_token', 'verified_session');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  };

  const revokeAdminSession = () => {
    setAdminSessionVerified(false);
    try {
      localStorage.removeItem('ssbd_admin_token');
    } catch {
      // ignore
    }
  };

  const syncProfile = async (firebaseUser: User | null) => {
    if (!firebaseUser) {
      setProfile(null);
      setLoading(false);
      return;
    }
    try {
      const p = await getOrCreateUserProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      });
      setProfile(p);
    } catch (err) {
      console.warn('Profile sync fallback:', err);
      setProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'Gamer',
        photoURL: firebaseUser.photoURL || undefined,
        walletBalance: 850,
        role: firebaseUser.email === AUTHORIZED_ADMIN_EMAIL ? 'admin' : 'customer',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      await syncProfile(u);
      if (u?.email === AUTHORIZED_ADMIN_EMAIL) {
        initializeDatabaseIfEmpty().catch(() => {});
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<User | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncProfile(result.user);
      return result.user;
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        alert('লগইন ব্যর্থ হয়েছে: ' + (err.message || 'দয়া করে আবার চেষ্টা করুন'));
      }
      return null;
    }
  };

  const logout = async () => {
    revokeAdminSession();
    await fbSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await syncProfile(user);
    }
  };

  const deductWalletBalance = async (amount: number): Promise<boolean> => {
    const currentBal = profile?.walletBalance ?? 850;
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
    const currentBal = profile?.walletBalance ?? 850;
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

  // Restrict admin access strictly to the explicitly authorized Google email
  const isAdmin = Boolean(
    user?.email && user.email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()
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
