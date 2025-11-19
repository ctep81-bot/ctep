import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.biblegame.exodus',
  appName: '出埃及记：旷野试炼',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;