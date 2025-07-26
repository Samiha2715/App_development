import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { DoctorCard } from '@/components/DoctorCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Doctor } from '@/types/database';

export default function DoctorsScreen() {
  const { user, loading: authLoading } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/login');
      return;
    }

    if (user) {
      fetchDoctors();
    }
  }, [user, authLoading]);

  const fetchDoctors = async () => {
    try {
      const doctorsQuery = query(
        collection(db, 'doctors')
      );
      const snapshot = await getDocs(doctorsQuery);
      const doctorsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Doctor[];
      
      // Sort doctors alphabetically in JavaScript
      const sortedDoctors = doctorsData.sort((a, b) => 
        a.full_name.localeCompare(b.full_name)
      );
      
      setDoctors(sortedDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      Alert.alert('Error', 'Failed to fetch doctors');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDoctors();
  };

  const handleDoctorPress = (doctor: Doctor) => {
    router.push({
      pathname: '/booking/[doctorId]',
      params: { doctorId: doctor.id },
    });
  };

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Doctors</Text>
        <Text style={styles.subtitle}>Choose your preferred specialist</Text>
      </View>

      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DoctorCard
            doctor={item}
            onPress={() => handleDoctorPress(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  listContainer: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
});