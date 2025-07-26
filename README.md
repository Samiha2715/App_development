# Medimeet - Doctor Appointment Booking App

A modern, cross-platform mobile application built with React Native and Expo that allows users to book and manage medical appointments with doctors.

## 🏥 Features

- **User Authentication**: Secure login and signup functionality
- **Doctor Discovery**: Browse and search for available doctors
- **Appointment Booking**: Schedule appointments with preferred doctors
- **Appointment Management**: View upcoming and past appointments
- **Dashboard**: Overview of appointment statistics and quick actions
- **Profile Management**: User profile and settings
- **Cross-Platform**: Available on iOS, Android, and Web

## 🛠️ Tech Stack

- **Framework**: React Native with Expo SDK 53
- **Navigation**: Expo Router (file-based routing)
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Language**: TypeScript
- **Styling**: React Native StyleSheet with custom design system
- **Icons**: Lucide React Native
- **State Management**: React Context API
- **Calendar**: React Native Calendars

## 📱 Project Structure

```text
app/
├── (tabs)/                 # Tab-based navigation screens
│   ├── index.tsx          # Dashboard/Home screen
│   ├── doctors.tsx        # Doctor listing screen
│   ├── appointments.tsx   # Appointments management
│   └── profile.tsx        # User profile screen
├── auth/                  # Authentication screens
│   ├── login.tsx          # Login screen
│   └── signup.tsx         # Signup screen
└── booking/               # Appointment booking flow
    └── [doctorId].tsx     # Dynamic doctor booking screen

components/
├── ui/                    # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── LoadingSpinner.tsx
├── AppointmentCard.tsx    # Appointment display component
└── DoctorCard.tsx         # Doctor profile component

contexts/
└── AuthContext.tsx        # Authentication context

lib/
├── firebase.ts           # Firebase configuration
└── appointmentUtils.ts   # Appointment utility functions

types/
└── database.ts           # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio/Android Emulator (for Android development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd App_development
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Firebase Setup**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore Database
   - Update Firebase configuration in `lib/firebase.ts` with your project credentials

4. **Start the development server**

   ```bash
   npm start
   # or
   expo start
   ```

5. **Run on platforms**

   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app for physical devices

## 📋 Available Scripts

- `npm start` - Start the Expo development server
- `npm run dev` - Start development server without telemetry
- `npm run build:web` - Build for web platform
- `npm run lint` - Run ESLint for code quality

## 🔧 Configuration

### Firebase Configuration

Update the `firebaseConfig` object in `lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### App Configuration

The app configuration is in `app.json`:

- App name: Medimeet
- Package identifier: medimeet-appointment-app
- Version: 1.0.0

## 🎨 Design System

The app uses a custom design system defined in `constants/Colors.ts` with:

- Consistent color palette
- Standardized spacing
- Border radius values
- Typography scales

## 📱 Screen Flow

1. **Authentication Flow**
   - Landing → Login/Signup → Dashboard

2. **Main App Flow**
   - Dashboard → Doctor Search → Booking → Confirmation
   - Appointments → View/Manage existing appointments
   - Profile → User settings and information

## 🔒 Security Features

- Firebase Authentication for secure user management
- Secure data storage with Firestore security rules
- Input validation and sanitization
- Protected routes and authentication guards

## 🌐 Platform Support

- **iOS**: Native iOS app through Expo
- **Android**: Native Android app through Expo
- **Web**: Progressive Web App (PWA) support


## 🚀 Future Enhancements

- [ ] Push notifications for appointment reminders
- [ ] Video consultation integration
- [ ] Payment gateway integration
- [ ] Advanced doctor search filters
- [ ] Appointment rating and reviews
- [ ] Multi-language support
- [ ] Dark mode theme
