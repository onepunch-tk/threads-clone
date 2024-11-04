// app.config.ts
import { ExpoConfig } from "expo/config";
import { withSentry } from "@sentry/react-native/expo";

const config: ExpoConfig = {
  name: "threads",
  slug: "threads",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    infoPlist: {
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: process.env.APP_ENV === "development",
      },
    },
    supportsTablet: true,
    bundleIdentifier: "com.tkstar.lecture-project",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.tkstar.threads",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-build-properties",
      {
        ios: {
          newArchEnabled: true,
          ccacheEnabled: true,
        },
        android: {
          newArchEnabled: true,
        },
      },
    ],
    "expo-font",
    "expo-secure-store",
    [
      "@sentry/react-native/expo",
      {
        organization: "tkstar",
        project: "threads",
        url: "https://sentry.io/",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
};

export default withSentry(config, {
  url: "https://sentry.io/",
  // Use SENTRY_AUTH_TOKEN env to authenticate with Sentry.
  project: "threads",
  organization: "tkstardev",
});
