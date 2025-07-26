import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Stethoscope } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isDoctorRegistration, setIsDoctorRegistration] = useState(false);
  const [doctorData, setDoctorData] = useState({
    specialization: '',
    description: '',
    years_experience: '',
    license_number: '',
    education: '',
    hospital_affiliation: '',
    consultation_fee: '',
    available_days: [] as string[],
    available_hours: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableDaysOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const availableHoursOptions = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Doctor-specific validations
    if (isDoctorRegistration) {
      if (!doctorData.specialization.trim()) {
        newErrors.specialization = 'Specialization is required';
      }
      if (!doctorData.description.trim()) {
        newErrors.description = 'Description is required';
      }
      if (!doctorData.years_experience.trim()) {
        newErrors.years_experience = 'Years of experience is required';
      } else if (isNaN(Number(doctorData.years_experience)) || Number(doctorData.years_experience) < 0) {
        newErrors.years_experience = 'Please enter a valid number';
      }
      if (!doctorData.license_number.trim()) {
        newErrors.license_number = 'License number is required';
      }
      if (!doctorData.education.trim()) {
        newErrors.education = 'Education is required';
      }
      if (!doctorData.consultation_fee.trim()) {
        newErrors.consultation_fee = 'Consultation fee is required';
      } else if (isNaN(Number(doctorData.consultation_fee)) || Number(doctorData.consultation_fee) < 0) {
        newErrors.consultation_fee = 'Please enter a valid amount';
      }
      if (doctorData.available_days.length === 0) {
        newErrors.available_days = 'Please select at least one available day';
      }
      if (doctorData.available_hours.length === 0) {
        newErrors.available_hours = 'Please select at least one available hour';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    const role = isDoctorRegistration ? 'doctor' : 'patient';
    const doctorRegistrationData = isDoctorRegistration ? {
      specialization: doctorData.specialization.trim(),
      description: doctorData.description.trim(),
      years_experience: Number(doctorData.years_experience),
      license_number: doctorData.license_number.trim(),
      education: doctorData.education.trim(),
      hospital_affiliation: doctorData.hospital_affiliation.trim(),
      consultation_fee: Number(doctorData.consultation_fee),
      available_days: doctorData.available_days,
      available_hours: doctorData.available_hours,
    } : undefined;

    const { error } = await signUp(
      formData.email.trim(),
      formData.password,
      formData.fullName.trim(),
      formData.phone.trim(),
      role,
      doctorRegistrationData
    );

    if (error) {
      Alert.alert('Sign Up Failed', error.message);
    } else {
      const successMessage = isDoctorRegistration 
        ? 'Doctor account created successfully! You can now sign in and start accepting appointments.'
        : 'Account created successfully! You can now sign in.';
      
      Alert.alert(
        'Success',
        successMessage,
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
      );
    }

    setLoading(false);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateDoctorData = (field: string, value: string) => {
    setDoctorData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleAvailableDay = (day: string) => {
    setDoctorData(prev => ({
      ...prev,
      available_days: prev.available_days.includes(day)
        ? prev.available_days.filter(d => d !== day)
        : [...prev.available_days, day]
    }));
    if (errors.available_days) {
      setErrors(prev => ({ ...prev, available_days: '' }));
    }
  };

  const toggleAvailableHour = (hour: string) => {
    setDoctorData(prev => ({
      ...prev,
      available_hours: prev.available_hours.includes(hour)
        ? prev.available_hours.filter(h => h !== hour)
        : [...prev.available_hours, hour]
    }));
    if (errors.available_hours) {
      setErrors(prev => ({ ...prev, available_hours: '' }));
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <Heart size={40} color={Colors.text.white} fill={Colors.text.white} />
          <Text style={styles.appName}>Medimeet</Text>
        </View>
        <Text style={styles.welcomeText}>Create Account</Text>
        <Text style={styles.subtitle}>Join us to manage your health journey</Text>
      </LinearGradient>

      <View style={styles.form}>
        {/* Registration Type Toggle */}
        <View style={styles.registrationTypeContainer}>
          <View style={styles.registrationTypeHeader}>
            <View style={styles.roleOption}>
              <Heart size={20} color={!isDoctorRegistration ? Colors.primary : Colors.text.secondary} />
              <Text style={[styles.roleText, !isDoctorRegistration && styles.activeRoleText]}>Patient</Text>
            </View>
            <Switch
              value={isDoctorRegistration}
              onValueChange={setIsDoctorRegistration}
              trackColor={{ false: Colors.primary, true: Colors.accent }}
              thumbColor={Colors.surface}
            />
            <View style={styles.roleOption}>
              <Stethoscope size={20} color={isDoctorRegistration ? Colors.accent : Colors.text.secondary} />
              <Text style={[styles.roleText, isDoctorRegistration && styles.activeDoctorRoleText]}>Doctor</Text>
            </View>
          </View>
          {isDoctorRegistration && (
            <Text style={styles.doctorNote}>
              Join our network of healthcare professionals
            </Text>
          )}
        </View>

        {/* Basic Information */}
        <Input
          label="Full Name"
          value={formData.fullName}
          onChangeText={(text) => updateFormData('fullName', text)}
          placeholder="Enter your full name"
          autoCapitalize="words"
          error={errors.fullName}
        />

        <Input
          label="Email Address"
          value={formData.email}
          onChangeText={(text) => updateFormData('email', text)}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <Input
          label="Phone Number"
          value={formData.phone}
          onChangeText={(text) => updateFormData('phone', text)}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          error={errors.phone}
        />

        <Input
          label="Password"
          value={formData.password}
          onChangeText={(text) => updateFormData('password', text)}
          placeholder="Create a password"
          secureTextEntry
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(text) => updateFormData('confirmPassword', text)}
          placeholder="Confirm your password"
          secureTextEntry
          error={errors.confirmPassword}
        />

        {/* Doctor-specific fields */}
        {isDoctorRegistration && (
          <View style={styles.doctorFields}>
            <Text style={styles.sectionTitle}>Professional Information</Text>
            
            <Input
              label="Medical Specialization"
              value={doctorData.specialization}
              onChangeText={(text) => updateDoctorData('specialization', text)}
              placeholder="e.g., Cardiologist, Dermatologist"
              error={errors.specialization}
            />

            <Input
              label="Professional Description"
              value={doctorData.description}
              onChangeText={(text) => updateDoctorData('description', text)}
              placeholder="Brief description of your expertise"
              multiline
              numberOfLines={3}
              error={errors.description}
            />

            <Input
              label="Years of Experience"
              value={doctorData.years_experience}
              onChangeText={(text) => updateDoctorData('years_experience', text)}
              placeholder="Enter years of experience"
              keyboardType="numeric"
              error={errors.years_experience}
            />

            <Input
              label="Medical License Number"
              value={doctorData.license_number}
              onChangeText={(text) => updateDoctorData('license_number', text)}
              placeholder="Enter your license number"
              error={errors.license_number}
            />

            <Input
              label="Education & Qualifications"
              value={doctorData.education}
              onChangeText={(text) => updateDoctorData('education', text)}
              placeholder="e.g., MD from Harvard Medical School"
              error={errors.education}
            />

            <Input
              label="Hospital Affiliation (Optional)"
              value={doctorData.hospital_affiliation}
              onChangeText={(text) => updateDoctorData('hospital_affiliation', text)}
              placeholder="Current hospital or clinic"
            />

            <Input
              label="Consultation Fee ($)"
              value={doctorData.consultation_fee}
              onChangeText={(text) => updateDoctorData('consultation_fee', text)}
              placeholder="Enter consultation fee"
              keyboardType="numeric"
              error={errors.consultation_fee}
            />

            {/* Available Days */}
            <View style={styles.availabilitySection}>
              <Text style={styles.availabilityLabel}>Available Days</Text>
              {errors.available_days && <Text style={styles.errorText}>{errors.available_days}</Text>}
              <View style={styles.optionsContainer}>
                {availableDaysOptions.map(day => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.optionChip,
                      doctorData.available_days.includes(day) && styles.selectedChip
                    ]}
                    onPress={() => toggleAvailableDay(day)}
                  >
                    <Text style={[
                      styles.optionText,
                      doctorData.available_days.includes(day) && styles.selectedOptionText
                    ]}>
                      {day.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Available Hours */}
            <View style={styles.availabilitySection}>
              <Text style={styles.availabilityLabel}>Available Hours</Text>
              {errors.available_hours && <Text style={styles.errorText}>{errors.available_hours}</Text>}
              <View style={styles.optionsContainer}>
                {availableHoursOptions.map(hour => (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.optionChip,
                      doctorData.available_hours.includes(hour) && styles.selectedChip
                    ]}
                    onPress={() => toggleAvailableHour(hour)}
                  >
                    <Text style={[
                      styles.optionText,
                      doctorData.available_hours.includes(hour) && styles.selectedOptionText
                    ]}>
                      {hour}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        <Button
          title="Create Account"
          onPress={handleSignUp}
          loading={loading}
          style={styles.signupButton}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
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
    paddingTop: 80,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.white,
    marginLeft: Spacing.md,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.white,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    padding: Spacing.xl,
    marginTop: -Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  registrationTypeContainer: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  registrationTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  activeRoleText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  activeDoctorRoleText: {
    color: Colors.accent,
    fontWeight: '600',
  },
  doctorNote: {
    fontSize: 12,
    color: Colors.text.light,
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  doctorFields: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  availabilitySection: {
    marginBottom: Spacing.lg,
  },
  availabilityLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginBottom: Spacing.xs,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  optionChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  selectedOptionText: {
    color: Colors.text.white,
    fontWeight: '500',
  },
  signupButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  loginLink: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
});