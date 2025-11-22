# SAHAYA - Women Safety App 🛡️

**SAHAYA** is a comprehensive women safety application built with React Native (Expo) for the frontend and Node.js/Express/MongoDB for the backend. The app provides real-time emergency assistance, location tracking, geofencing, trip monitoring, and SMS-based alerts to ensure women's safety in various situations.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Features Deep Dive](#features-deep-dive)
- [API Documentation](#api-documentation)
- [Mobile App Screens](#mobile-app-screens)
- [Backend Services](#backend-services)
- [Security](#security)
- [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

SAHAYA is designed to provide women with a comprehensive safety solution that works even in low-network conditions. The app combines multiple safety features including emergency SOS, location sharing, geofencing, trip tracking, and emergency contacts management.

### Key Highlights

- ✅ **Real-time SOS Alerts** - Instant emergency notifications to trusted contacts
- ✅ **SMS Fallback** - Works even with poor internet connectivity via Twilio SMS
- ✅ **Geofencing** - Define safe zones and get alerts when entering/exiting
- ✅ **Trip Tracking** - Monitor journeys with route deviation detection
- ✅ **Location Sharing** - Share real-time location with emergency contacts
- ✅ **Background Monitoring** - Continuous safety monitoring even when app is closed
- ✅ **Auto Check-ins** - Scheduled safety check-ins with automatic alerts
- ✅ **Free Maps** - Uses OpenStreetMap via Leaflet (no API keys required)

---

## 🚀 Features

### 1. **Emergency SOS System**

- **One-tap SOS**: Press and hold button to trigger emergency alert
- **SMS Fallback**: Low-network SOS sends SMS to all emergency contacts via Twilio
- **Location Sharing**: Automatically shares current GPS coordinates
- **Multi-channel Alerts**: Sends notifications via app and SMS simultaneously

### 2. **Emergency Contacts Management**

- Add unlimited emergency contacts with name and phone number
- Contacts receive SOS alerts via SMS and app notifications
- Easy management: add, view, and delete contacts
- Persistent storage with backend synchronization

### 3. **Geofencing (Safe Zones)**

- Create custom safe zones (home, office, friend's place, etc.)
- Define radius for each geofence (in meters)
- Automatic entry/exit detection using background location tracking
- Push notifications when entering or leaving safe zones
- SMS alerts to emergency contacts when leaving safe zones

### 4. **Trip Tracking & Monitoring**

- Start trip with destination and estimated time of arrival (ETA)
- Real-time location updates during trip
- Route deviation detection with configurable threshold
- Automatic alerts if user deviates from planned route
- Manual check-in and alert options
- Trip history and status tracking

### 5. **Auto Check-in System**

- Schedule periodic safety check-ins
- Automatic alerts if check-in is missed
- Configurable check-in intervals
- Backend scheduler monitors missed check-ins

### 6. **Location Sharing**

- Share real-time location with emergency contacts
- View latest location of other users (with permission)
- Location history tracking
- Works with both foreground and background location access

### 7. **Safe Route Planning**

- Interactive map using OpenStreetMap (Leaflet)
- No Google Maps API key required (Expo Go compatible)
- Route visualization on map
- Works offline with cached map tiles

### 8. **Low-Network Mode**

- Dedicated SMS-based SOS for poor connectivity
- Uses Twilio for reliable SMS delivery
- Minimal data usage
- Fallback mechanism for all critical features

### 9. **User Authentication**

- Secure JWT-based authentication
- Password hashing with bcrypt
- Phone number-based registration
- Token-based API access

### 10. **Premium Features (Planned)**

- Advanced analytics and safety reports
- Extended geofence limits
- Priority SMS delivery
- 24/7 emergency response team connection

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     SAHAYA Mobile App                        │
│                   (React Native + Expo)                      │
├─────────────────────────────────────────────────────────────┤
│  Screens          │  Components       │  Services            │
│  - Home           │  - SOSButton      │  - API Client        │
│  - SOS            │  - LocationShare  │  - Geofence Watcher  │
│  - Geofence       │  - LeafletMap     │  - Location Service  │
│  - Contacts       │  - HomeComponents │  - Auth Service      │
│  - Trip Tracking  │                   │                      │
│  - Safe Routes    │                   │                      │
│  - Profile        │                   │                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Server (Node.js)                  │
├─────────────────────────────────────────────────────────────┤
│  Routes           │  Controllers      │  Services            │
│  - /api/auth      │  - authController │  - dbService         │
│  - /api/sos       │  - sosController  │  - smsService        │
│  - /api/contacts  │  - contactCtrl    │  - checkInScheduler  │
│  - /api/geofence  │  - geofenceCtrl   │  - locationService   │
│  - /api/trips     │  - tripController │                      │
│  - /api/location  │  - locationCtrl   │                      │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │   MongoDB    │    │    Twilio    │
            │   Database   │    │   SMS API    │
            └──────────────┘    └──────────────┘
```

### Data Flow

1. **User Authentication**: User registers/logs in → JWT token stored in AsyncStorage
2. **SOS Trigger**: User presses SOS → Location fetched → Backend notified → SMS sent to contacts
3. **Geofence Monitoring**: Background task runs → Location checked → Geofence boundaries evaluated → Notifications sent
4. **Trip Tracking**: Trip started → Location updates sent periodically → Route deviation calculated → Alerts triggered if needed

---

## 💻 Technology Stack

### Frontend (Mobile App)

| Technology               | Purpose                           |
| ------------------------ | --------------------------------- |
| **React Native**         | Cross-platform mobile development |
| **Expo**                 | Development framework and tooling |
| **Expo Router**          | File-based navigation             |
| **TypeScript**           | Type-safe development             |
| **NativeWind**           | Tailwind CSS for React Native     |
| **Axios**                | HTTP client for API calls         |
| **AsyncStorage**         | Local data persistence            |
| **Expo Location**        | GPS and location services         |
| **Expo Notifications**   | Push notifications                |
| **Expo Task Manager**    | Background tasks                  |
| **React Native WebView** | Embed web content (maps)          |
| **Leaflet**              | OpenStreetMap integration         |

### Backend (Server)

| Technology     | Purpose                       |
| -------------- | ----------------------------- |
| **Node.js**    | JavaScript runtime            |
| **Express.js** | Web application framework     |
| **MongoDB**    | NoSQL database                |
| **Mongoose**   | MongoDB ODM                   |
| **JWT**        | Authentication tokens         |
| **bcryptjs**   | Password hashing              |
| **Twilio**     | SMS service provider          |
| **Geolib**     | Geospatial calculations       |
| **Morgan**     | HTTP request logger           |
| **CORS**       | Cross-origin resource sharing |
| **dotenv**     | Environment configuration     |

---

## 📁 Project Structure

```
New folder/
├── SAHAYA/                          # Frontend React Native App
│   ├── app/                         # Application code
│   │   ├── screens/                 # Screen components
│   │   │   ├── HomeScreen.tsx       # Main dashboard
│   │   │   ├── LoginScreen.tsx      # User login
│   │   │   ├── SignUpScreen.tsx     # User registration
│   │   │   ├── ContactsScreen.tsx   # Emergency contacts
│   │   │   ├── GeofenceScreen.tsx   # Geofence management
│   │   │   ├── LowNetworkSOS.tsx    # SMS-based SOS
│   │   │   ├── SafeRouteScreen.tsx  # Route planning
│   │   │   ├── LocationViewerScreen.tsx # View locations
│   │   │   ├── AutoCheckInScreen.tsx # Check-in management
│   │   │   ├── ProfileScreen.tsx    # User profile
│   │   │   ├── SettingsScreen.tsx   # App settings
│   │   │   ├── PricingScreen.tsx    # Premium plans
│   │   │   └── SafetyScreen.tsx     # Safety tips
│   │   ├── components/              # Reusable components
│   │   │   ├── SOSButton.tsx        # Emergency SOS button
│   │   │   ├── LocationShareButton.tsx # Location sharing
│   │   │   ├── LeafletMap.tsx       # Map component
│   │   │   └── HomeComponents.tsx   # Dashboard widgets
│   │   ├── navigation/              # Navigation setup
│   │   ├── _layout.tsx              # Root layout
│   │   └── index.tsx                # Entry point
│   ├── services/                    # API services
│   │   └── api.ts                   # API client & endpoints
│   ├── utils/                       # Utility functions
│   │   └── GeofenceWatcher.ts       # Background geofence monitoring
│   ├── package.json                 # Dependencies
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── metro.config.js              # Metro bundler config
│   └── app.json                     # Expo configuration
│
├── node_backend/                    # Backend Server
│   ├── src/
│   │   ├── config/                  # Configuration
│   │   │   └── db.js                # Database connection
│   │   ├── models/                  # Mongoose models
│   │   │   ├── User.js              # User schema
│   │   │   ├── Contact.js           # Emergency contact schema
│   │   │   ├── SOS.js               # SOS alert schema
│   │   │   ├── Location.js          # Location history schema
│   │   │   ├── Geofence.js          # Geofence schema
│   │   │   ├── Trip.js              # Trip tracking schema
│   │   │   └── CheckIn.js           # Check-in schema
│   │   ├── controllers/             # Request handlers
│   │   │   ├── authController.js    # Authentication logic
│   │   │   ├── sosController.js     # SOS handling
│   │   │   ├── contactController.js # Contact management
│   │   │   ├── geofenceController.js # Geofence logic
│   │   │   ├── tripController.js    # Trip tracking
│   │   │   ├── locationController.js # Location sharing
│   │   │   ├── checkInController.js # Check-in management
│   │   │   └── adminController.js   # Admin operations
│   │   ├── routes/                  # API routes
│   │   │   ├── authRoutes.js        # /api/auth/*
│   │   │   ├── sosRoutes.js         # /api/sos/*
│   │   │   ├── contactRoutes.js     # /api/contacts/*
│   │   │   ├── geofenceRoutes.js    # /api/geofence/*
│   │   │   ├── tripRoutes.js        # /api/trips/*
│   │   │   ├── locationRoutes.js    # /api/location/*
│   │   │   ├── checkInRoutes.js     # /api/checkin/*
│   │   │   └── adminRoutes.js       # /api/admin/*
│   │   ├── services/                # Business logic
│   │   │   ├── dbService.js         # Database operations
│   │   │   ├── smsService.js        # Twilio SMS integration
│   │   │   ├── checkInScheduler.js  # Automated check-in monitoring
│   │   │   └── locationService.js   # Location utilities
│   │   └── middleware/              # Express middleware
│   │       ├── authMiddleware.js    # JWT verification
│   │       ├── validateRequest.js   # Error handling
│   │       └── asyncHandler.js      # Async error wrapper
│   ├── server.js                    # Server entry point
│   ├── package.json                 # Dependencies
│   └── .env.example                 # Environment template
│
└── readme.md                        # This file
```

---

## 🔧 Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **Expo CLI** (`npm install -g expo-cli`)
- **Twilio Account** (for SMS functionality)
- **Android/iOS device or emulator**

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd node_backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your credentials:

   ```env
   MONGO_URI=mongodb://localhost:27017/women_safety
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   NODE_ENV=development

   # Twilio Credentials
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

4. **Start MongoDB**

   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd SAHAYA
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Update API configuration**

   Edit `services/api.ts` and update `LOCAL_IP` with your machine's IP address:

   ```typescript
   const LOCAL_IP = "192.168.x.x"; // Your local IP
   ```

4. **Start the Expo development server**

   ```bash
   npm start
   ```

5. **Run on device/emulator**
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app on physical device

---

## 🎨 Features Deep Dive

### 1. Emergency SOS System

#### How It Works

1. User presses and holds the SOS button on the home screen
2. App requests location permission (if not already granted)
3. Current GPS coordinates are fetched
4. SOS alert is sent to backend with user ID and location
5. Backend retrieves all emergency contacts for the user
6. SMS messages are sent to all contacts via Twilio
7. Push notifications are sent to contacts who have the app
8. SOS record is saved in database with timestamp

#### Technical Implementation

**Frontend (`SOSButton.tsx`)**

```typescript
- Long press gesture detection (500ms)
- Location permission handling
- API call to /api/sos/trigger
- Loading states and error handling
- Success confirmation
```

**Backend (`sosController.js`)**

```typescript
- Validates user authentication
- Fetches emergency contacts from database
- Formats SMS message with Google Maps link
- Sends bulk SMS via Twilio
- Stores SOS record with location and timestamp
- Returns delivery status
```

#### SMS Message Format

```
EMERGENCY! [User Name] has triggered an SOS alert.
Location: https://maps.google.com/?q=[latitude],[longitude]
Time: [timestamp]
```

### 2. Geofencing System

#### Capabilities

- Create unlimited geofences (safe zones)
- Each geofence has:
  - Name (e.g., "Home", "Office")
  - Center coordinates (latitude, longitude)
  - Radius in meters
  - Active/inactive status
- Background monitoring every 10 seconds or 10 meters
- Entry/exit event detection
- Local notifications and SMS alerts

#### Background Task Implementation

**GeofenceWatcher.ts**

```typescript
- Uses Expo Task Manager for background execution
- Registers GEOFENCE_TRACKING_TASK
- Runs even when app is closed
- Requests foreground and background location permissions
- Sends location to backend for geofence checking
- Triggers notifications based on events
```

**Backend Geofence Logic**

```typescript
- Calculates distance between current location and all geofences
- Uses Haversine formula for accurate distance calculation
- Determines if user is inside or outside each geofence
- Compares with previous state to detect entry/exit
- Sends SMS to emergency contacts on exit from safe zone
```

### 3. Trip Tracking

#### Features

- Start trip with destination and ETA
- Real-time location updates
- Route path recording
- Deviation detection with configurable threshold (default: 100m)
- Automatic alerts on route deviation
- Manual check-in and alert options
- Trip completion tracking

#### Route Deviation Algorithm

```typescript
1. Store planned route as array of coordinates
2. Receive periodic location updates from app
3. Calculate minimum distance from current location to any point on route
4. If distance > threshold (100m), mark as deviated
5. Send SMS alert to emergency contacts with current location
6. Update trip status to "alerted"
```

**Trip States**

- `active` - Trip in progress
- `completed` - Trip ended successfully
- `alerted` - Deviation detected or manual alert triggered

### 4. Auto Check-in System

#### How It Works

1. User schedules check-in with interval (e.g., every 30 minutes)
2. Backend scheduler runs every minute
3. Checks for overdue check-ins (missed by > 5 minutes)
4. Sends SMS alerts to emergency contacts if check-in missed
5. Updates check-in status to "missed"

**Backend Scheduler (`checkInScheduler.js`)**

```typescript
- Uses setInterval to run every 60 seconds
- Queries database for active check-ins
- Calculates time since last check-in
- Triggers alerts for overdue check-ins
- Prevents duplicate alerts
```

### 5. Location Sharing

#### Functionality

- Share current location with backend
- Location stored with timestamp
- Retrieve latest location of any user
- Location history tracking
- Privacy controls (only shared with emergency contacts)

**API Endpoints**

- `POST /api/location/share` - Share current location
- `GET /api/location/:userId/latest` - Get user's latest location

### 6. Safe Route Planning

#### OpenStreetMap Integration

- Uses Leaflet.js in WebView (no API keys needed)
- Free and open-source mapping
- Works in Expo Go (no development build required)
- Interactive map with zoom and pan
- Route visualization
- Marker placement for start/end points

**LeafletMap Component**

```typescript
- Renders HTML with Leaflet library
- Injects JavaScript for map initialization
- Handles user interactions
- Communicates with React Native via postMessage
- Displays routes and markers
```

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All protected routes require JWT token in header:

```
Authorization: Bearer <token>
```

### Endpoints

#### **Authentication**

**Register User**

```http
POST /auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "+1234567890",
  "password": "securePassword123"
}

Response: 201 Created
{
  "_id": "user_id",
  "name": "Jane Doe",
  "phone": "+1234567890",
  "token": "jwt_token"
}
```

**Login**

```http
POST /auth/login
Content-Type: application/json

{
  "phone": "+1234567890",
  "password": "securePassword123"
}

Response: 200 OK
{
  "_id": "user_id",
  "name": "Jane Doe",
  "phone": "+1234567890",
  "token": "jwt_token"
}
```

#### **Emergency Contacts**

**Add Contact**

```http
POST /contacts/add
Authorization: Bearer <token>

{
  "name": "Emergency Contact",
  "phone": "+9876543210"
}

Response: 201 Created
{
  "_id": "contact_id",
  "user": "user_id",
  "name": "Emergency Contact",
  "phone": "+9876543210"
}
```

**Get All Contacts**

```http
GET /contacts/:userId
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "_id": "contact_id",
    "name": "Emergency Contact",
    "phone": "+9876543210"
  }
]
```

**Delete Contact**

```http
DELETE /contacts/:contactId
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Contact removed"
}
```

#### **SOS Alerts**

**Trigger SOS**

```http
POST /sos/trigger
Authorization: Bearer <token>

{
  "location": {
    "lat": 37.7749,
    "lon": -122.4194
  }
}

Response: 200 OK
{
  "message": "SOS sent",
  "sos": {
    "_id": "sos_id",
    "user": "user_id",
    "location": { "lat": 37.7749, "lon": -122.4194 },
    "timestamp": "2025-11-22T08:00:00.000Z"
  },
  "smsResults": [...]
}
```

**SMS-based SOS (Low Network)**

```http
POST /sos/sms-trigger
Authorization: Bearer <token>

{
  "userId": "user_id",
  "location": { "lat": 37.7749, "lon": -122.4194 },
  "triggerType": "LOW_NETWORK"
}

Response: 200 OK
{
  "message": "SMS SOS sent",
  "results": [...]
}
```

#### **Geofencing**

**Create Geofence**

```http
POST /geofence/create
Authorization: Bearer <token>

{
  "name": "Home",
  "center": { "lat": 37.7749, "lon": -122.4194 },
  "radius": 500
}

Response: 201 Created
{
  "_id": "geofence_id",
  "user": "user_id",
  "name": "Home",
  "center": { "lat": 37.7749, "lon": -122.4194 },
  "radius": 500,
  "isActive": true
}
```

**Get User Geofences**

```http
GET /geofence/:userId
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "_id": "geofence_id",
    "name": "Home",
    "center": { "lat": 37.7749, "lon": -122.4194 },
    "radius": 500,
    "isActive": true
  }
]
```

**Check Geofence (Background)**

```http
POST /geofence/check
Authorization: Bearer <token>

{
  "location": { "lat": 37.7750, "lon": -122.4195 }
}

Response: 200 OK
{
  "event": "enter",
  "geofence": {
    "name": "Home",
    "center": { "lat": 37.7749, "lon": -122.4194 }
  }
}
```

**Delete Geofence**

```http
DELETE /geofence/:geofenceId
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Geofence deleted"
}
```

#### **Trip Tracking**

**Start Trip**

```http
POST /trips/start
Authorization: Bearer <token>

{
  "destination": "Office",
  "eta": "2025-11-22T09:00:00.000Z",
  "estimatedDuration": 30,
  "startLocation": { "lat": 37.7749, "lon": -122.4194 },
  "routePath": [
    { "latitude": 37.7749, "longitude": -122.4194 },
    { "latitude": 37.7750, "longitude": -122.4195 }
  ]
}

Response: 201 Created
{
  "_id": "trip_id",
  "user": "user_id",
  "destination": "Office",
  "status": "active",
  "startLocation": { "lat": 37.7749, "lon": -122.4194 }
}
```

**Update Trip Location**

```http
POST /trips/location
Authorization: Bearer <token>

{
  "tripId": "trip_id",
  "latitude": 37.7751,
  "longitude": -122.4196
}

Response: 200 OK
{
  "isDeviated": false,
  "currentLocation": {
    "latitude": 37.7751,
    "longitude": -122.4196,
    "updatedAt": "2025-11-22T08:15:00.000Z"
  }
}
```

**End Trip**

```http
POST /trips/end
Authorization: Bearer <token>

{
  "tripId": "trip_id"
}

Response: 200 OK
{
  "_id": "trip_id",
  "status": "completed"
}
```

**Send Trip Alert**

```http
POST /trips/alert
Authorization: Bearer <token>

{
  "tripId": "trip_id"
}

Response: 200 OK
{
  "message": "Alert sent",
  "trip": {...}
}
```

#### **Location Sharing**

**Share Location**

```http
POST /location/share
Authorization: Bearer <token>

{
  "latitude": 37.7749,
  "longitude": -122.4194
}

Response: 201 Created
{
  "_id": "location_id",
  "user": "user_id",
  "location": { "lat": 37.7749, "lon": -122.4194 },
  "timestamp": "2025-11-22T08:00:00.000Z"
}
```

**Get Latest Location**

```http
GET /location/:userId/latest
Authorization: Bearer <token>

Response: 200 OK
{
  "_id": "location_id",
  "user": "user_id",
  "location": { "lat": 37.7749, "lon": -122.4194 },
  "timestamp": "2025-11-22T08:00:00.000Z"
}
```

---

## 📱 Mobile App Screens

### 1. **Home Screen**

- Emergency SOS button (press and hold)
- Quick action cards (Fake Call, Loud Alarm, Safety Status)
- Location share button
- Premium upgrade banner
- System status indicators

### 2. **Login/Signup Screens**

- Phone number-based authentication
- Secure password input
- Form validation
- JWT token storage

### 3. **Contacts Screen**

- List of emergency contacts
- Add new contact form
- Delete contact functionality
- Pull-to-refresh

### 4. **Geofence Screen**

- List of all geofences
- Create new geofence with current location
- Set geofence name and radius
- Delete geofences
- Start background monitoring

### 5. **Low Network SOS Screen**

- Dedicated SMS-based SOS trigger
- Works with minimal internet
- Location-based SMS alerts
- Simple one-button interface

### 6. **Safe Route Screen**

- Interactive OpenStreetMap
- Route planning
- Marker placement
- Zoom and pan controls

### 7. **Location Viewer Screen**

- View latest location of contacts
- Map visualization
- Timestamp display

### 8. **Auto Check-in Screen**

- Schedule check-ins
- Set interval
- Manual check-in button
- Check-in history

### 9. **Profile Screen**

- User information
- Account settings
- Logout option

### 10. **Settings Screen**

- App preferences
- Notification settings
- Privacy controls

### 11. **Pricing Screen**

- Premium plan details
- Feature comparison
- Upgrade options

### 12. **Safety Screen**

- Safety tips and guidelines
- Emergency resources
- Educational content

---

## 🔐 Security

### Authentication & Authorization

- **JWT Tokens**: Secure, stateless authentication
- **Password Hashing**: bcrypt with salt rounds (10)
- **Token Expiry**: Configurable token lifetime
- **Protected Routes**: Middleware validates tokens on all protected endpoints

### Data Security

- **HTTPS**: All API communication encrypted (production)
- **Environment Variables**: Sensitive credentials stored in .env
- **Input Validation**: Request validation middleware
- **SQL Injection Prevention**: Mongoose ODM prevents injection attacks
- **XSS Protection**: Input sanitization

### Privacy

- **Location Data**: Only shared with emergency contacts
- **Contact Privacy**: Contacts only accessible by owner
- **User Consent**: Explicit permission for location access
- **Data Retention**: Configurable data retention policies

---

## 🛠️ Backend Services

### 1. **Database Service (`dbService.js`)**

- Abstraction layer for database operations
- CRUD operations for all models
- Query optimization
- Error handling

### 2. **SMS Service (`smsService.js`)**

- Twilio integration
- Bulk SMS sending
- Message formatting
- Delivery status tracking
- Error handling and retries

### 3. **Check-in Scheduler (`checkInScheduler.js`)**

- Background job scheduler
- Monitors active check-ins
- Triggers alerts for missed check-ins
- Prevents duplicate notifications

### 4. **Location Service (`locationService.js`)**

- Geospatial calculations
- Distance computation (Haversine formula)
- Coordinate validation
- Location history management

---

## 🔮 Future Enhancements

### Planned Features

- [ ] **AI-powered Threat Detection**: Machine learning to detect unusual patterns
- [ ] **Voice-activated SOS**: Trigger SOS with voice command
- [ ] **Fake Call Feature**: Simulate incoming call to escape situations
- [ ] **Loud Alarm**: Siren sound to attract attention
- [ ] **Video Recording**: Automatic video recording during SOS
- [ ] **Live Streaming**: Stream video to emergency contacts
- [ ] **Community Safety Network**: Connect with nearby users
- [ ] **Safe Place Directory**: Database of safe locations (police stations, hospitals)
- [ ] **Multi-language Support**: Internationalization
- [ ] **Wearable Integration**: Smartwatch support
- [ ] **Offline Mode**: Enhanced offline functionality
- [ ] **Analytics Dashboard**: Safety insights and reports
- [ ] **Emergency Services Integration**: Direct connection to police/ambulance

### Technical Improvements

- [ ] **Supabase Migration**: Move from MongoDB to Supabase
- [ ] **Push Notification Service**: Firebase Cloud Messaging
- [ ] **Real-time Updates**: WebSocket for live location sharing
- [ ] **Caching**: Redis for improved performance
- [ ] **Load Balancing**: Horizontal scaling
- [ ] **Automated Testing**: Unit and integration tests
- [ ] **CI/CD Pipeline**: Automated deployment
- [ ] **Docker Containerization**: Easy deployment
- [ ] **API Rate Limiting**: Prevent abuse
- [ ] **Logging & Monitoring**: Comprehensive error tracking

---

## 📞 Support & Contact

For issues, questions, or contributions:

- **GitHub Issues**: [Report bugs or request features]
- **Email**: support@sahaya.app
- **Documentation**: [Link to detailed docs]

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Expo Team**: For the amazing React Native framework
- **Twilio**: For reliable SMS services
- **OpenStreetMap**: For free mapping data
- **MongoDB**: For flexible database solution
- **All Contributors**: Thank you for making SAHAYA better!

---

## 🚨 Emergency Disclaimer

**SAHAYA is a safety assistance tool and should not be considered a replacement for emergency services. In case of immediate danger, always call local emergency services (911, 112, etc.) first.**

---

**Built with ❤️ for Women's Safety**

_Version 1.0.0 - Last Updated: November 2025_
