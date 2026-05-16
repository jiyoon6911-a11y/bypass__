import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  displayName: string;
  photoURL?: string;
  historyPrivacy: 'public' | 'followers' | 'private';
  onboardingCompleted: boolean;
  preferences?: {
    genres?: string[];
    accessibility?: string[];
    services?: string[];
  };
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = undefined;
      }

      if (u) {
        unsubProfile = onSnapshot(doc(db, 'users', u.uid), (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            setProfile(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("Firestore user profile snapshot error:", error);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubProfile) {
        unsubProfile();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
        {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
