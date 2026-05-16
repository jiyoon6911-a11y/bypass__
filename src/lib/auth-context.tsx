import React, { createContext, useContext, useEffect, useState } from 'react';

// Fake types
export interface User { uid: string; email: string; displayName: string; photoURL: string; }
export interface UserProfile extends User {
  username: string; historyPrivacy: 'public' | 'followers' | 'private'; onboardingCompleted: boolean; preferences?: any;
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
    // Check mock logged in state
    const currentId = localStorage.getItem('mockLoggedIn');
    const fakeUser = currentId ? { uid: `mock_${currentId}`, email: `${currentId}@example.com`, displayName: 'Mock User', photoURL: '' } : null;
    
    // Simulate loading
    setTimeout(() => {
      if (fakeUser) {
        setUser(fakeUser);
        const savedProfile = localStorage.getItem(`mockProfile_${currentId}`);
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        } else {
          setProfile({ ...fakeUser, username: currentId as string, historyPrivacy: 'public', onboardingCompleted: false });
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    }, 500);

    // Provide a way to bypass update profile globally for the onboarding screen
    (window as any).mockUpdateProfile = (newProfileData: any) => {
      if (!currentId) return;
      const baseUser = { uid: `mock_${currentId}`, email: `${currentId}@example.com`, displayName: 'Mock User', photoURL: '' };
      const merged = { ...baseUser, ...newProfileData };
      setProfile(merged);
      localStorage.setItem(`mockProfile_${currentId}`, JSON.stringify(merged));
    };

    return () => {};
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
        {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
