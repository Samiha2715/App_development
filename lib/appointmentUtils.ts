import { Doctor } from '@/types/database';

export const formatAppointmentDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatAppointmentTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export const isDoctorAvailableOnDate = (doctor: Doctor, dateString: string): boolean => {
  const date = new Date(dateString);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  return doctor.available_days.includes(dayName);
};

export const getAvailableTimeSlotsForDoctor = (
  doctor: Doctor,
  dateString: string,
  bookedSlots: string[] = []
): string[] => {
  if (!isDoctorAvailableOnDate(doctor, dateString)) {
    return [];
  }

  return doctor.available_hours.filter(hour => !bookedSlots.includes(hour));
};

export const getAppointmentStatusColor = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return '#059669'; // success/green - booked
    case 'cancelled':
      return '#DC2626'; // error/red
    case 'completed':
      return '#6B7280'; // secondary/gray
    default:
      return '#059669'; // default to confirmed/green
  }
};

export const getAppointmentStatusText = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'Booked';
    case 'cancelled':
      return 'Cancelled';
    case 'completed':
      return 'Completed';
    default:
      return 'Booked';
  }
};

export const isDateInPast = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const canCancelAppointment = (
  appointmentDate: string,
  appointmentTime: string,
  status: string
): boolean => {
  if (status !== 'confirmed') {
    return false;
  }

  // Can't cancel if appointment is in the past
  if (isDateInPast(appointmentDate)) {
    return false;
  }

  // Can't cancel if appointment is within 2 hours
  const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
  const now = new Date();
  const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  
  return appointmentDateTime > twoHoursFromNow;
};

export const generateTimeSlots = (
  startHour: number = 8,
  endHour: number = 18,
  intervalMinutes: number = 30
): string[] => {
  const slots: string[] = [];
  
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      if (hour === endHour && minute > 0) break;
      
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  
  return slots;
};
