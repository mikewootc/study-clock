import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mikewootc.pomocap',
  appName: 'PomoCap',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
