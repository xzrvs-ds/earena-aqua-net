import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.773412e38bfe4c2bb6606e9e1328cfc0',
  appName: 'eArena Water Control',
  webDir: 'dist',
  server: {
    url: 'https://773412e3-8bfe-4c2b-b660-6e9e1328cfc0.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0ea5e9',
      showSpinner: true,
      spinnerColor: '#ffffff',
    },
  },
};

export default config;
