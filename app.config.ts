import { ConfigContext, ExpoConfig } from "@expo/config";
import { withSentry } from "@sentry/react-native/expo";

const expoConfig = ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
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
          NSAllowsArbitraryLoads: true,
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
          organization: "tkstardev",
          project: "threads",
          url: "https://sentry.io/",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  };
};

export default (ctx: ConfigContext) => {
  const config = expoConfig(ctx);
  return withSentry(config, {
    url: "https://sentry.io/",
    project: "threads",
    organization: "tkstardev",
  });
};
