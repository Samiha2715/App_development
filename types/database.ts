export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'patient' | 'doctor';
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  full_name: string;
  specialization: string;
  description: string;
  image_url: string;
  years_experience: number;
  rating: number;
  available_days: string[];
  available_hours: string[];
  license_number: string;
  education: string;
  hospital_affiliation?: string;
  consultation_fee: number;
  is_approved: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
}