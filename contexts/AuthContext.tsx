import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User } from 'firebase/auth';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phone: string, role?: 'patient' | 'doctor', doctorData?: DoctorRegistrationData) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (fullName: string, phone: string) => Promise<{ error: any }>;
}

interface DoctorRegistrationData {
  specialization: string;
  description: string;
  years_experience: number;
  license_number: string;
  education: string;
  hospital_affiliation?: string;
  consultation_fee: number;
  available_days: string[];
  available_hours: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (isMounted.current) {
        setUser(user);
        setLoading(false);
      }
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string, 
    password: string, 
    fullName: string, 
    phone: string, 
    role: 'patient' | 'doctor' = 'patient',
    doctorData?: DoctorRegistrationData
  ) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        full_name: fullName,
        phone,
        role,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

  
      if (role === 'doctor' && doctorData) {
        await setDoc(doc(db, 'doctors', user.uid), {
          user_id: user.uid,
          full_name: fullName,
          specialization: doctorData.specialization,
          description: doctorData.description,
          image_url: '', 
          years_experience: doctorData.years_experience,
          rating: 0, 
          available_days: doctorData.available_days,
          available_hours: doctorData.available_hours,
          license_number: doctorData.license_number,
          education: doctorData.education,
          hospital_affiliation: doctorData.hospital_affiliation || '',
          consultation_fee: doctorData.consultation_fee,
          is_approved: true, 
          created_at: serverTimestamp(),
        });
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updateProfile = async (fullName: string, phone: string) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        full_name: fullName,
        phone,
        updated_at: serverTimestamp(),
      });

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}