import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Heart, Calendar, Users, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface DashboardStats {
  totalAppointments: number;
  upcomingAppointments: number;
  totalDoctors: number;
}

export default function HomeScreen() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    upcomingAppointments: 0,
    totalDoctors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/login');
      return;
    }

    if (user) {
      fetchDashboardStats();
    }
  }, [user, authLoading]);

  const fetchDashboardStats = async () => {
    try {
      const appointmentsQuery = query(
        collection(db, 'appointments'),
        where('user_id', '==', user?.uid)
      );
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      
      const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
      
      const appointments = appointmentsSnapshot.docs.map(doc => doc.data());
      const totalAppointments = appointments.length;
      const upcomingAppointments = appointments.filter(
        (apt: any) => apt.status === 'confirmed' || apt.status === 'pending'
      ).length;
      const totalDoctors = doctorsSnapshot.docs.length;

      setStats({
        totalAppointments,
        upcomingAppointments,
        totalDoctors,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  const quickActions = [
    {
      title: 'Book Appointment',
      icon: Calendar,
      color: Colors.primary,
      onPress: () => router.push('/doctors'),
    },
    {
      title: 'View Doctors',
      icon: Users,
      color: Colors.secondary,
      onPress: () => router.push('/doctors'),
    },
    {
      title: 'My Appointments',
      icon: Clock,
      color: Colors.accent,
      onPress: () => router.push('/appointments'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        style={styles.header}
      >
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.headerTitle}>Your Health Dashboard</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Heart size={24} color={Colors.primary} />
            <Text style={styles.statNumber}>{stats.totalAppointments}</Text>
            <Text style={styles.statLabel}>Total Appointments</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={24} color={Colors.success} />
            <Text style={styles.statNumber}>{stats.upcomingAppointments}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={24} color={Colors.accent} />
            <Text style={styles.statNumber}>{stats.totalDoctors}</Text>
            <Text style={styles.statLabel}>Available Doctors</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { borderLeftColor: action.color }]}
              onPress={action.onPress}
              activeOpacity={0.8}
            >
              <action.icon size={24} color={action.color} />
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.healthTip}>
          <Text style={styles.tipTitle}>💡 Health Tip</Text>
          <Text style={styles.tipText}>
            Regular check-ups help detect health issues early. Schedule your routine appointments today!
          </Text>
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
    padding: Spacing.xl,
    paddingTop: 60,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.text.white,
    opacity: 0.9,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.white,
    marginTop: Spacing.xs,
  },
  content: {
    padding: Spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  statCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: Spacing.xs,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginTop: Spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  actionsContainer: {
    marginBottom: Spacing.xl,
  },
  actionCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginLeft: Spacing.md,
  },
  healthTip: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  tipText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});