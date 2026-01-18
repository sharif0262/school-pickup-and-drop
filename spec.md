# School Pick Up & Drop Off Mobile App with Admin Dashboard & Geo Fencing

## Overview
A React Native mobile application for school transportation management that connects parents and drivers for safe and efficient student pick-up and drop-off services. The app runs on both Android and iOS devices with comprehensive data privacy and security features.

## Authentication System
The app supports multiple authentication methods:
- **Google Sign-In** using native SDK integration for both Android and iOS
- **Apple Sign-In** for iOS devices using native Apple authentication
- **Mobile Number OTP Login** where users request an OTP, receive it via SMS, and verify to complete authentication
- **Internet Identity** as fallback authentication method
- Secure token storage using device keychain/keystore
- Smooth navigation flow from login → profile setup → role-based dashboard

### Login Interface
The opening login screen features a welcoming splash-style layout with:
- App logo prominently displayed at the top
- App tagline beneath the logo
- Three prominent sign-in buttons optimized for mobile touch interaction:
  1. **Sign in with Google** button using Google SDK authentication hooks
  2. **Sign in with Apple** button using Apple authentication logic
  3. **Sign in with Mobile Number** button that triggers an OTP entry modal for phone number input and verification
- Mobile-optimized design with large touch targets, safe area margins, and minimal clutter
- Responsive layout for both iOS and Android devices
- On successful authentication, users are routed to profile setup or role selection flow

## User Roles

### Parents
- Book pick-up or drop-off requests for their children
- View real-time tracking of driver location and trip status
- Receive push notifications for boarding, arrival, and drop-off events
- Access child profiles with basic information (name, grade, allergies, emergency contact)
- Trigger SOS alerts during emergencies
- Chat with drivers through in-app messaging
- View trip status with color-coded indicators (Green: On the Way, Yellow: Reached, Red: Alert)

### Drivers
- View assigned routes and student lists
- Mark student attendance for pickup and drop-off confirmation
- Send trip status updates (start trip, on route, arrived at destination)
- Access route maps with GPS tracking and ETA calculations
- Use SOS button for emergency situations
- Submit feedback reports
- Chat with parents through in-app messaging

### Admin
- Manage user accounts and permissions
- Monitor system-wide trip activities
- Access reporting and analytics dashboard

## Core Features

### Booking System
- Parents can create pick-up and drop-off requests
- Support for single or multiple students per trip
- Trip scheduling functionality

### Real-Time Tracking
- Live GPS tracking of driver location using device GPS
- Trip status updates with color-coded display
- Route deviation alerts
- ETA calculations

### Communication
- In-app chat between parents and drivers
- Push notifications for trip events
- SOS alert system for emergencies

### Safety Features
- Emergency contact information storage
- Allergy and medical information tracking
- Safety alert buttons for both parents and drivers

### Mobile-Specific Features
- Push notifications for real-time updates
- Device GPS integration for location tracking
- Native mobile UI components optimized for touch interaction
- Offline capability for essential features
- Biometric authentication support where available

### Privacy & Security Features
- Privacy Policy page accessible from app settings
- Privacy notice displayed after user login with acknowledgment
- Compliance statements for GDPR-ready practices, no third-party data sharing, and anonymized analytics
- Secure authentication token storage using device security features

## Project Export Feature
- **Download Project Bundle**: Admin users can generate and download a complete ZIP archive containing all project source files
- The ZIP bundle includes:
  - Frontend TypeScript/React components and configuration files
  - Backend Motoko canister source code and deployment configurations
  - All generated and custom assets (images, icons, etc.)
  - Project configuration files (package.json, dfx.json, etc.)
  - Documentation and README files
- The backend provides an endpoint to generate the ZIP archive on-demand
- The frontend provides a download button in the admin dashboard to trigger the bundle generation and download
- **Immediate Download**: When the admin clicks the download button, the ZIP archive is generated and automatically downloaded to the user's device
- The download includes all current project files in their latest state
- **Direct Download Link**: The system generates a direct download link that allows users to download the complete project bundle without requiring admin authentication
- The download link provides access to the entire project source code including backend, frontend, assets, and all configuration files
- **Enhanced ZIP Archive Contents**: The downloadable ZIP archive contains the complete application source code organized in proper directory structure:
  - All backend Motoko files (.mo) from the backend/ directory
  - All frontend files (.tsx, .ts, .css) from the frontend/src/ directory
  - Configuration files (package.json, dfx.json, tsconfig.json, etc.)
  - Asset files (images, icons, generated content)
  - Documentation and README files
- **Direct Download Access**: The system provides a publicly accessible direct download link for the bundled archive that works without authentication requirements

## File Content Display Feature
- **Frontend File Viewer**: Admin users can view the complete contents of all frontend source files directly in the admin dashboard
- The admin dashboard includes a file viewer section that displays the full content of key frontend files including:
  - App.tsx (main application component)
  - useQueries.ts (custom hooks for data fetching)
  - Header.tsx and Footer.tsx (layout components)
  - All page components (LoginScreen, ProfileSetup, RoleSelection, ParentDashboard, DriverDashboard, AdminDashboard, PrivacyPolicy)
  - All feature-specific components (ChildrenManagement, TripBooking, TripTracking, ParentChat, AssignedRoutes, LocationSharing, DriverChat, PrivacyNoticeBanner, SystemOverview, UserManagement)
  - Styling files (index.css)
- The file contents are displayed in a readable format with proper syntax highlighting
- Each file is clearly labeled with its full path for easy identification
- The file viewer provides a comprehensive overview of the entire frontend codebase structure and implementation

## Data Storage (Backend)
- User profiles for parents, drivers, and admins (encrypted at rest)
- Authentication tokens and session management for multiple auth providers
- OTP generation and verification system for mobile number authentication
- Child profiles with personal and medical information (encrypted at rest)
- Trip bookings and schedules (encrypted at rest)
- Route information and GPS coordinates (encrypted at rest)
- Chat message history (encrypted at rest and in transit)
- Trip status and attendance records
- Emergency contact details (encrypted at rest)
- Push notification tokens for mobile devices
- Project source files and assets for ZIP bundle generation
- Frontend file contents for display in the admin dashboard
- Strong symmetric encryption for all sensitive data before storage
- Automatic decryption only for authorized users verified through any supported authentication method
- Data encryption in transit for all communications

## User Interface
- Native mobile UI components for optimal performance
- Touch-optimized interface with large, easily accessible buttons
- Color-coded trip status indicators (Green/Yellow/Red)
- Responsive design optimized for various mobile screen sizes
- English language interface
- Native navigation patterns for iOS and Android
- Privacy Policy page accessible from app settings
- Smooth transitions between authentication, profile setup, and dashboard screens
- Welcoming splash-style login screen with prominent branding and authentication options
- Admin dashboard includes a prominent "Download Project Bundle" button that immediately triggers the ZIP archive generation and download when clicked
- Admin dashboard includes a comprehensive file viewer section that displays the complete contents of all frontend source files
- Direct download link interface that provides immediate access to the complete project bundle with enhanced ZIP archive contents
- File content display interface with syntax highlighting and clear file path labels
