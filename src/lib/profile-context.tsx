import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export interface Profile {
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
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => void;
  loading: boolean;
}

const DEFAULT_PROFILE: Profile = {
  displayName: '방문자',
  username: 'visitor',
  onboardingCompleted: true,
  photoURL: '',
  historyPrivacy: 'public',
  preferences: {
    genres: ['뮤지컬', '연극'],
    accessibility: ['휠체어 접근성', '자막 제공'],
    services: []
  }
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('guest_profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved profile', e);
      }
    }
    setLoading(false);
  }, []);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('guest_profile', JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(() => ({ profile, updateProfile, loading }), [profile, updateProfile, loading]);

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
