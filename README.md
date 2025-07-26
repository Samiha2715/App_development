# Medimeet 🏥

A modern healthcare appointment booking mobile application built with React Native, Expo, and Firebase. Medimeet connects patients with healthcare professionals, enabling seamless appointment scheduling and management.

## 📱 Features

### For Patients
- **User Registration & Authentication** - Secure signup/login system
- **Doctor Discovery** - Browse and search for healthcare professionals by specialization
- **Appointment Booking** - Easy scheduling with real-time availability checking
- **Appointment Management** - View, track, and manage your appointments
- **Doctor Profiles** - Detailed information including specialization, experience, and ratings

### For Doctors
- **Professional Registration** - Complete profile setup with credentials and experience
- **Availability Management** - Set working days and hours during registration
- **Automatic Appointment Confirmation** - Instant booking confirmation without manual approval
- **Patient Appointment Tracking** - View and manage patient appointments

### General Features
- **Real-time Updates** - Live appointment status and availability
- **Responsive Design** - Optimized for all device sizes
- **Secure Data Storage** - Firebase Firestore for reliable data management
- **Cross-platform** - Works on both iOS and Android

## 🛠️ Technology Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router
- **UI Components**: Custom components with Lucide React Native icons
- **Styling**: StyleSheet with custom design system
- **Backend**: Firebase
  - Authentication
  - Firestore Database
- **State Management**: React Context API
- **Development**: TypeScript for type safety

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ARNOB663/Medimeet.git
   cd Medimeet
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Firebase Configuration**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Update the configuration in `lib/firebase.ts` with your Firebase credentials:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.firebasestorage.app",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

5. **Run on device/simulator**
   - Scan the QR code with Expo Go app (mobile)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

## 📱 App Structure

```
app/
├── (tabs)/                 # Tab navigation screens
│   ├── index.tsx          # Home screen
│   ├── doctors.tsx        # Doctor listing
│   ├── appointments.tsx   # Appointment management
│   └── profile.tsx        # User profile
├── auth/                  # Authentication screens
│   ├── login.tsx          # Login screen
│   └── signup.tsx         # Registration screen
├── booking/               # Appointment booking
│   └── [doctorId].tsx     # Doctor booking screen
components/                # Reusable UI components
├── ui/                    # Basic UI components
├── DoctorCard.tsx         # Doctor display card
└── AppointmentCard.tsx    # Appointment display card
lib/                       # Utilities and configurations
├── firebase.ts            # Firebase setup
└── appointmentUtils.ts    # Appointment helper functions
types/                     # TypeScript type definitions
└── database.ts            # Database schema types
```

## 🔥 Firebase Collections

### Users Collection
```typescript
{
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'patient' | 'doctor';
  created_at: string;
  updated_at: string;
}
```

### Doctors Collection
```typescript
{
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
```

### Appointments Collection
```typescript
{
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
```

## 🎨 Design System

### Colors
- **Primary**: `#2563EB` (Blue)
- **Secondary**: `#059669` (Green)
- **Accent**: `#F59E0B` (Orange)
- **Success**: `#059669` (Green)
- **Error**: `#DC2626` (Red)
- **Background**: `#F8FAFC` (Light Gray)
- **Surface**: `#FFFFFF` (White)

### Typography
- **Primary Text**: `#1F2937`
- **Secondary Text**: `#6B7280`
- **Light Text**: `#9CA3AF`

## 🚀 Key Features Implementation

### Authentication Flow
- Email/password authentication with Firebase Auth
- Role-based registration (Patient/Doctor)
- Automatic profile creation in Firestore
- Persistent authentication state

### Appointment System
- Real-time availability checking
- Conflict prevention (no double booking)
- Automatic confirmation (no manual approval needed)
- Status tracking (Confirmed, Cancelled, Completed)

### Doctor Registration
- Comprehensive professional information collection
- Availability scheduling (days and hours)
- Automatic approval for immediate access
- Professional credentials storage

### Smart Availability
- Dynamic time slot filtering based on doctor's schedule
- Real-time conflict checking
- Client-side sorting to avoid Firebase index requirements

## 🔧 Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
# Web
npm run build:web

# Mobile (requires EAS CLI)
eas build --platform all
```

### Linting
```bash
npm run lint
```

## 📱 Screenshots

*[Add screenshots of your app here]*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**ARNOB663** - [GitHub Profile](https://github.com/ARNOB663)

## 🙏 Acknowledgments

- Firebase for backend services
- Expo team for the amazing development platform
- Lucide React Native for beautiful icons
- React Native community for continuous support

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/ARNOB663/Medimeet/issues) section
2. Create a new issue if your problem isn't already listed
3. Contact the maintainer through GitHub

---

**Made with ❤️ for better healthcare accessibility**
