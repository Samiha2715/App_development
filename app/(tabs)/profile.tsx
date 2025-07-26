import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { User, Mail, Phone, LogOut } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface UserProfile {
  full_name: string;
  phone: string;
}

export default function ProfileScreen() {
  const { user, signOut, updateProfile, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/login');
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const fetchProfile = async () => {
    try {
      if (!user?.uid) return;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfile({
          full_name: userData.full_name || '',
          phone: userData.phone || '',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile.full_name.trim()) {
      Alert.alert('Error', 'Full name is required');
      return;
    }

    if (!profile.phone.trim()) {
      Alert.alert('Error', 'Phone number is required');
      return;
    }

    setUpdating(true);
    const { error } = await updateProfile(profile.full_name, profile.phone);

    if (error) {
      Alert.alert('Error', 'Failed to update profile');
    } else {
      Alert.alert('Success', 'Profile updated successfully');
    }

    setUpdating(false);
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const { error } = await signOut();
            if (error) {
              Alert.alert('Error', 'Failed to sign out');
            } else {
              router.replace('/auth/login');
            }
          },
        },
      ],
    );
  };

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account information</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <User size={40} color={Colors.primary} />
          </View>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <Input
            label="Full Name"
            value={profile.full_name}
            onChangeText={(text) => setProfile(prev => ({ ...prev, full_name: text }))}
            placeholder="Enter your full name"
            autoCapitalize="words"
          />

          <Input
            label="Phone Number"
            value={profile.phone}
            onChangeText={(text) => setProfile(prev => ({ ...prev, phone: text }))}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />

          <Button
            title="Update Profile"
            onPress={handleUpdateProfile}
            loading={updating}
            style={styles.updateButton}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="outline"
            style={[styles.signOutButton, { borderColor: Colors.error }]}
            textStyle={{ color: Colors.error }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: 60,
    backgroundColor: Colors.surface,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  content: {
    padding: Spacing.lg,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  email: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  updateButton: {
    marginTop: Spacing.sm,
  },
  signOutButton: {
    borderWidth: 1,
  },
});