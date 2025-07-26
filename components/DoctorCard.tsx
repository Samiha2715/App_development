import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Star } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { Doctor } from '@/types/database';

// Mock data for testing
const mockDoctors: Doctor[] = [
  {
    id: '1',
    user_id: 'user_1',
    full_name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    description: 'Experienced cardiologist specializing in heart disease prevention and treatment. Dedicated to providing comprehensive cardiac care.',
    image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    years_experience: 15,
    rating: 4.8,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    available_hours: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    license_number: 'MD123456',
    education: 'MD from Harvard Medical School, Cardiology Fellowship at Mayo Clinic',
    hospital_affiliation: 'City General Hospital',
    consultation_fee: 200,
    is_approved: true,
    created_at: '2023-01-15T08:00:00Z'
  },
  {
    id: '2',
    user_id: 'user_2',
    full_name: 'Dr. Michael Chen',
    specialization: 'Dermatologist',
    description: 'Board-certified dermatologist with expertise in skin cancer detection, cosmetic procedures, and general dermatology.',
    image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    years_experience: 8,
    rating: 4.6,
    available_days: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    available_hours: ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00'],
    license_number: 'MD789012',
    education: 'MD from Johns Hopkins, Dermatology Residency at UCSF',
    hospital_affiliation: 'Metro Skin Care Center',
    consultation_fee: 150,
    is_approved: true,
    created_at: '2023-02-20T10:30:00Z'
  },
  {
    id: '3',
    user_id: 'user_3',
    full_name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatrician',
    description: 'Compassionate pediatrician focused on providing comprehensive healthcare for children from infancy through adolescence.',
    image_url: 'https://images.unsplash.com/photo-1594824388647-82b8e2ff0d1e?w=400&h=400&fit=crop&crop=face',
    years_experience: 12,
    rating: 4.9,
    available_days: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    available_hours: ['08:30', '09:30', '10:30', '14:30', '15:30', '16:30'],
    license_number: 'MD345678',
    education: 'MD from Stanford Medical School, Pediatric Residency at UCLA',
    hospital_affiliation: 'Children\'s Medical Center',
    consultation_fee: 180,
    is_approved: true,
    created_at: '2023-03-10T14:15:00Z'
  }
];

interface DoctorCardProps {
  doctor: Doctor;
  onPress: () => void;
}

export function DoctorCard({ doctor, onPress }: DoctorCardProps) {
  const imageSource = doctor.image_url 
    ? { uri: doctor.image_url }
    : { uri: 'https://via.placeholder.com/80x80/CCCCCC/FFFFFF?text=Dr' };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{doctor.full_name}</Text>
        <Text style={styles.specialization}>{doctor.specialization}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {doctor.description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Star size={16} color={Colors.accent} fill={Colors.accent} />
            <Text style={styles.ratingText}>{doctor.rating}</Text>
          </View>
          <Text style={styles.experience}>{doctor.years_experience} years exp.</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Export mock data for use in other components
export { mockDoctors };

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  specialization: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  experience: {
    fontSize: 12,
    color: Colors.text.light,
  },
});