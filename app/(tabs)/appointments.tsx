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
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { AppointmentCard } from '@/components/AppointmentCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface AppointmentWithDoctor {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  doctor: {
    full_name: string;
    specialization: string;
  };
}

export default function AppointmentsScreen() {
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentWithDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/login');
      return;
    }

    if (user) {
      fetchAppointments();
    }
  }, [user, authLoading]);

  const fetchAppointments = async () => {
    try {
      if (!user?.uid) return;
      
      const appointmentsQuery = query(
        collection(db, 'appointments'),
        where('user_id', '==', user.uid)
      );
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      
      const formattedAppointments = await Promise.all(
        appointmentsSnapshot.docs.map(async (appointmentDoc) => {
          const appointmentData = appointmentDoc.data();
          
          // Fetch doctor data for each appointment
          const doctorDoc = await getDoc(doc(db, 'doctors', appointmentData.doctor_id));
          const doctorData = doctorDoc.data();
          
          return {
            id: appointmentDoc.id,
            appointment_date: appointmentData.appointment_date,
            appointment_time: appointmentData.appointment_time,
            status: appointmentData.status,
            notes: appointmentData.notes || '',
            doctor: {
              full_name: doctorData?.full_name || 'Unknown Doctor',
              specialization: doctorData?.specialization || 'Unknown Specialization',
            },
          };
        })
      );

      // Sort appointments by date in JavaScript instead of Firestore
      const sortedAppointments = formattedAppointments.sort((a, b) => {
        return new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime();
      });

      setAppointments(sortedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Alert.alert('Error', 'Failed to fetch appointments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Appointments</Text>
        <Text style={styles.subtitle}>Manage your scheduled visits</Text>
      </View>

      {appointments.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No appointments yet</Text>
          <Text style={styles.emptySubtitle}>
            Book your first appointment with our specialists
          </Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AppointmentCard
              doctorName={item.doctor.full_name}
              specialization={item.doctor.specialization}
              date={formatDate(item.appointment_date)}
              time={formatTime(item.appointment_time)}
              status={item.status}
            />
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});