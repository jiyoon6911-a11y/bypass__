import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';

export interface Profile {
  uid: string;
  displayName: string;
  username: string;
  onboardingCompleted: boolean;
  photoURL: string;
  historyPrivacy: 'public' | 'followers' | 'private';
  preferences: {
    genres: string[];
    accessibility: string[];
    services: string[];
  };
}

interface ProfileContextType {
  user: User | null;
  profile: Profile | null;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const DEFAULT_PREFERENCES = {
  genres: ['뮤지컬', '연극'],
  accessibility: ['휠체어 접근성', '자막 제공'],
  services: []
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setProfile(docSnap.data() as Profile);
      } else {
        // Create initial profile if it doesn't exist
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const newProfile: Profile = {
          uid: currentUser.uid,
          displayName: currentUser.displayName || '사용자',
          username: currentUser.email?.split('@')[0] || `user_${Math.floor(Math.random() * 10000)}`,
          onboardingCompleted: false,
          photoURL: currentUser.photoURL || '',
          historyPrivacy: 'public',
          preferences: DEFAULT_PREFERENCES,
        };

        await setDoc(docRef, {
          ...newProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchProfile]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign-Out Error:', error);
      throw error;
    }
  };

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return;
    
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  }, [user]);

  const value = useMemo(() => ({ 
    user, 
    profile, 
    updateProfile, 
    signInWithGoogle, 
    signOut, 
    loading 
  }), [user, profile, updateProfile, loading]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
