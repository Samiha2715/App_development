import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Clock } from 'lucide-react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  addDoc, 
  collection, 
  serverTimestamp, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Doctor } from '@/types/database';
import { 
  isDoctorAvailableOnDate, 
  getAvailableTimeSlotsForDoctor,
  formatAppointmentDate,
  formatAppointmentTime 
} from '@/lib/appointmentUtils';

export default function BookingScreen() {
  const { doctorId } = useLocalSearchParams<{ doctorId: string }>();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  useEffect(() => {
    if (!user) {
      router.replace('/auth/login');
      return;
    }

    fetchDoctor();
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      const doctorDoc = await getDoc(doc(db, 'doctors', doctorId!));
      
      if (!doctorDoc.exists()) {
        Alert.alert('Error', 'Doctor not found');
        router.back();
        return;
      }
      
      const doctorData = {
        id: doctorDoc.id,
        ...doctorDoc.data()
      } as Doctor;
      
      setDoctor(doctorData);
    } catch (error) {
      console.error('Error fetching doctor:', error);
      Alert.alert('Error', 'Failed to fetch doctor details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedSlots = async (date: string) => {
    try {
      const appointmentsQuery = query(
        collection(db, 'appointments'),
        where('doctor_id', '==', doctorId!),
        where('appointment_date', '==', date),
        where('status', 'in', ['confirmed', 'completed'])
      );
      
      const snapshot = await getDocs(appointmentsQuery);
      const booked = snapshot.docs.map(doc => doc.data().appointment_time);
      setBookedSlots(booked);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      setBookedSlots([]);
    }
  };

  const getAvailableTimeSlots = () => {
    if (!doctor || !selectedDate) return [];

    return getAvailableTimeSlotsForDoctor(doctor, selectedDate, bookedSlots);
  };

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
    setSelectedTime(''); // Reset selected time when date changes
    fetchBookedSlots(day.dateString);
  };

  useEffect(() => {
    if (selectedDate) {
      const available = getAvailableTimeSlots();
      setAvailableTimeSlots(available);
    }
  }, [selectedDate, bookedSlots, doctor]);

  const handleBookAppointment = async () => {
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date');
      return;
    }

    if (!selectedTime) {
      Alert.alert('Error', 'Please select a time');
      return;
    }

    // Double-check availability before booking
    if (!availableTimeSlots.includes(selectedTime)) {
      Alert.alert('Error', 'Selected time slot is no longer available');
      setSelectedTime('');
      fetchBookedSlots(selectedDate);
      return;
    }

    setBooking(true);

    try {
      await addDoc(collection(db, 'appointments'), {
        user_id: user?.uid!,
        doctor_id: doctorId!,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        status: 'confirmed',
        notes: '',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      Alert.alert(
        'Success',
        `Appointment confirmed with ${doctor?.full_name} on ${formatAppointmentDate(selectedDate)} at ${formatAppointmentTime(selectedTime)}. Your appointment is booked!`,
        [
          {
            text: 'View Appointments',
            onPress: () => router.push('/(tabs)/appointments'),
          },
        ]
      );
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!doctor) {
    return null;
  }

  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctor.full_name}</Text>
          <Text style={styles.specialization}>{doctor.specialization}</Text>
          <Text style={styles.description}>{doctor.description}</Text>
          
          <View style={styles.availabilityInfo}>
            <Text style={styles.availabilityTitle}>Availability:</Text>
            <Text style={styles.availabilityText}>
              {doctor.available_days.join(', ')}
            </Text>
            <Text style={styles.consultationFee}>
              Consultation Fee: ${doctor.consultation_fee}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Select Date</Text>
          </View>
          <RNCalendar
            onDayPress={handleDateSelect}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: Colors.primary,
              },
            }}
            minDate={minDate}
            maxDate={maxDate}
            disableAllTouchEventsForDisabledDays={true}
            theme={{
              backgroundColor: Colors.surface,
              calendarBackground: Colors.surface,
              textSectionTitleColor: Colors.text.secondary,
              selectedDayBackgroundColor: Colors.primary,
              selectedDayTextColor: Colors.text.white,
              todayTextColor: Colors.primary,
              dayTextColor: Colors.text.primary,
              textDisabledColor: Colors.text.light,
              arrowColor: Colors.primary,
              monthTextColor: Colors.text.primary,
              indicatorColor: Colors.primary,
            }}
          />
        </View>

        {selectedDate && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Select Time</Text>
            </View>
            {availableTimeSlots.length === 0 ? (
              <View style={styles.noSlotsContainer}>
                <Text style={styles.noSlotsText}>
                  No available time slots for this date
                </Text>
                <Text style={styles.noSlotsSubtext}>
                  Please select a different date
                </Text>
              </View>
            ) : (
              <View style={styles.timeSlots}>
                {availableTimeSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlot,
                      selectedTime === time && styles.selectedTimeSlot,
                    ]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text
                      style={[
                        styles.timeSlotText,
                        selectedTime === time && styles.selectedTimeSlotText,
                      ]}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {selectedDate && selectedTime && (
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Appointment Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Doctor:</Text>
              <Text style={styles.summaryValue}>{doctor.full_name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date:</Text>
              <Text style={styles.summaryValue}>
                {formatAppointmentDate(selectedDate)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time:</Text>
              <Text style={styles.summaryValue}>{formatAppointmentTime(selectedTime)}</Text>
            </View>
          </View>
        )}

        <Button
          title="Book Appointment"
          onPress={handleBookAppointment}
          loading={booking}
          disabled={!selectedDate || !selectedTime}
          style={styles.bookButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: Spacing.sm,
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.white,
  },
  content: {
    flex: 1,
  },
  doctorInfo: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  specialization: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  availabilityInfo: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  availabilityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  availabilityText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  consultationFee: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  section: {
    margin: Spacing.lg,
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  noSlotsContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  noSlotsText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  noSlotsSubtext: {
    fontSize: 14,
    color: Colors.text.light,
    textAlign: 'center',
  },
  timeSlot: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    minWidth: 70,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeSlotText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    color: Colors.text.white,
  },
  summary: {
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  bookButton: {
    margin: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
});