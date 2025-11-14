# eArena Water Control - Mobile + Admin Panel

A comprehensive IoT-based water and energy management system built with React, TypeScript, Vite, and Capacitor. Features real-time MQTT integration, multi-language support (uz, ru, en), and beautiful mobile-first design.

## 🚀 Features

- **Real-time Monitoring**: Live device sensor data via MQTT
- **Device Control**: Motor, timer, and height controls
- **Reports & Analytics**: Daily and monthly energy/water usage reports
- **Multi-language**: Support for Uzbek, Russian, and English
- **Mobile-First**: Capacitor integration for native mobile apps
- **Offline Support**: Command queueing and cached state
- **Beautiful UI**: Modern design with Framer Motion animations

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Mobile**: Capacitor.js (iOS & Android)
- **State Management**: Zustand + React Query
- **Real-time**: MQTT.js
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **i18n**: i18next + react-i18next
- **Charts**: Recharts

## 📋 Prerequisites

- Node.js 18+ and npm
- For iOS development: macOS with Xcode
- For Android development: Android Studio

## 🔧 Installation

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd earena-water-control

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:5001

# MQTT Broker Configuration
VITE_MQTT_URL=mqtt://185.217.131.96:1883
VITE_MQTT_USERNAME=tr12345678
VITE_MQTT_PASSWORD=tr12345678

# Default Settings
VITE_DEFAULT_LANGUAGE=uz
```

### 3. Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## 📱 Mobile Development (Capacitor)

### Initial Setup

```bash
# Build the web app first
npm run build

# Add iOS platform (macOS only)
npx cap add ios

# Add Android platform
npx cap add android

# Sync web assets and update native platforms
npx cap sync
```

### Running on Device/Emulator

```bash
# iOS (requires macOS + Xcode)
npx cap run ios

# Android (requires Android Studio)
npx cap run android
```

### Development Workflow

1. Make changes to your React code
2. Run `npm run build` to build the web assets
3. Run `npx cap sync` to sync changes to native platforms
4. Run `npx cap run ios` or `npx cap run android`

For faster development, you can use the live reload feature by keeping the `server.url` in `capacitor.config.ts` pointing to your local dev server.

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── TopBar.tsx      # Navigation bar
│   ├── DeviceCard.tsx  # Device card component
│   └── StatusBadge.tsx # Online/offline status
├── lib/                # Utilities and services
│   ├── api.ts          # Axios API client
│   ├── mqtt.ts         # MQTT client wrapper
│   ├── storage.ts      # Capacitor Storage helpers
│   └── i18n.ts         # i18next configuration
├── pages/              # Application pages
│   ├── Login.tsx       # Authentication page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── DeviceDetail.tsx # Device control page
│   ├── Reports.tsx     # Reports and analytics
│   └── Settings.tsx    # User settings
├── store/              # State management
│   └── auth.ts         # Auth store (Zustand)
└── App.tsx             # Root component with routing
```

## 🔌 API Integration

The app integrates with a NestJS backend providing:

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration (admin only)

### Devices
- `GET /api/v1/devices` - List all devices
- `GET /api/v1/devices/:id` - Get device details
- `POST /api/v1/devices` - Create device (admin)
- `PATCH /api/v1/devices/:id` - Update device (admin)
- `DELETE /api/v1/devices/:id` - Delete device (admin)

### Reports
- `GET /api/v1/reports/daily` - Daily reports
- `GET /api/v1/reports/monthly` - Monthly reports
- `POST /api/v1/reports` - Create report

### MQTT Publishing
- `POST /api/v1/mqtt/publish` - Publish MQTT message via backend

## 📡 MQTT Integration

### Topics Structure

**Subscribe (Mobile App):**
- `devices/{deviceId}/sensor` - Real-time sensor data
- `devices/{deviceId}/status` - Device online/offline status
- `devices/{deviceId}/report_ack` - Report acknowledgments

**Publish (Commands):**
- `devices/{deviceId}/command` - Send control commands

### Command Format

```typescript
// Motor control
{
  type: 'motor',
  state: 'ON' | 'OFF'
}

// Timer control
{
  type: 'timer',
  duration: 120  // seconds
}

// Height control
{
  type: 'height',
  value: 100  // cm
}
```

### Sensor Data Format

```typescript
{
  waterDepth: 45.5,      // cm
  height: 120.0,         // cm
  flowRate: 15.2,        // L/min
  power: 850.5,          // Watts
  current: 3.8,          // Amps
  motorState: true,      // boolean
  timerRemaining: "02:15", // HH:MM
  timestamp: "2025-01-01T12:00:00Z"
}
```

## 🌍 Internationalization

The app supports three languages:
- **Uzbek (uz)** - Default
- **Russian (ru)**
- **English (en)**

Language is persisted in localStorage and can be changed from the top bar menu or settings page.

## 🔐 Authentication & Storage

- JWT tokens stored securely using Capacitor Preferences
- Automatic token refresh on API calls
- Offline command queueing
- Device state caching for offline access

## 🎨 Design System

The app uses a water/energy-themed design:
- **Primary (Cyan Blue)**: Water-related metrics and actions
- **Secondary (Emerald Green)**: Energy-related metrics
- **Semantic tokens**: All colors defined in `src/index.css`
- **Responsive**: Mobile-first with breakpoints for tablet/desktop

## 🧪 Testing

```bash
# Run TypeScript type checking
npm run build

# Run linter
npm run lint
```

## 📦 Building for Production

### Web Build
```bash
npm run build
```

### iOS Build
```bash
npm run build
npx cap sync ios
npx cap open ios
# Build in Xcode
```

### Android Build
```bash
npm run build
npx cap sync android
npx cap open android
# Build in Android Studio
```

## 🔄 Offline Behavior

- Commands are queued when offline
- Last known device states are cached
- Automatic reconnection with exponential backoff
- Queue is flushed when connection restored

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5001` |
| `VITE_MQTT_URL` | MQTT broker URL | `mqtt://185.217.131.96:1883` |
| `VITE_MQTT_USERNAME` | MQTT username | `tr12345678` |
| `VITE_MQTT_PASSWORD` | MQTT password | `tr12345678` |
| `VITE_DEFAULT_LANGUAGE` | Default UI language | `uz` |

## 🚨 Troubleshooting

### MQTT Connection Issues
- Verify broker URL and credentials
- Check firewall settings
- Ensure WebSocket support on broker

### Capacitor Sync Errors
- Run `npm run build` before `npx cap sync`
- Clean native build folders
- Reinstall native platforms if needed

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ by the eArena team

---

For more information or support, please contact the development team.
