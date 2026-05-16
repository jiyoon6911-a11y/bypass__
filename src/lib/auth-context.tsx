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
    // Fake login
    const fakeUser = { uid: 'mock_123', email: 'test@example.com', displayName: 'Mock User', photoURL: '' };
    setUser(fakeUser);
    
    // Simulate loading
    setTimeout(() => {
      // By default mock user goes to onboarding.
      // If we used a simulated login, we would have user profile loaded.
      const savedProfile = localStorage.getItem('mockProfile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        setProfile({ ...fakeUser, username: '', historyPrivacy: 'public', onboardingCompleted: false });
      }
      setLoading(false);
    }, 500);

    // Provide a way to bypass update profile globally for the onboarding screen
    (window as any).mockUpdateProfile = (newProfileData: any) => {
      const merged = { ...fakeUser, ...newProfileData };
      setProfile(merged);
      localStorage.setItem('mockProfile', JSON.stringify(merged));
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
