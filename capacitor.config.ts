import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.threadsofgrace.app',
  appName: 'Threads of Grace',
  webDir: 'dist',
  backgroundColor: '#F5F0E8',
  android: {
    backgroundColor: '#F5F0E8',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: '#324A3A',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#F5F0E8',
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#324A3A',
    },
  },
};

export default config;
