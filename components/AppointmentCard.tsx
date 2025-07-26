import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Calendar, Clock, User } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';

interface AppointmentCardProps {
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  onPress?: () => void;
}

export function AppointmentCard({
  doctorName,
  specialization,
  date,
  time,
  status,
  onPress,
}: AppointmentCardProps) {
  const statusColors = {
    pending: Colors.warning,
    confirmed: Colors.success,
    cancelled: Colors.error,
    completed: Colors.text.light,
  };

  const statusColor = statusColors[status];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.doctorInfo}>
          <User size={20} color={Colors.primary} />
          <View style={styles.doctorText}>
            <Text style={styles.doctorName}>{doctorName}</Text>
            <Text style={styles.specialization}>{specialization}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.dateTimeContainer}>
        <View style={styles.dateTime}>
          <Calendar size={16} color={Colors.text.secondary} />
          <Text style={styles.dateTimeText}>{date}</Text>
        </View>
        <View style={styles.dateTime}>
          <Clock size={16} color={Colors.text.secondary} />
          <Text style={styles.dateTimeText}>{time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  doctorText: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  specialization: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text.white,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dateTimeText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});