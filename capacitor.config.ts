import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.redthread.nutrinuts',
  appName: 'Red Thread',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    Browser: {
      // Used for Razorpay payment flow
    },
  },
};

export default config;
