import React, { useState, useEffect } from "react";
import { ImageRequireSource } from "react-native";
import { ApplicationProvider } from "react-native-ui-kitten";
import { mapping } from "@eva-design/eva";

import { ApplicationLoader, IAssets, IFonts } from "@src/core/loader/apploader";
import {
  ThemeContext,
  ThemeContextType,
  ThemeKey,
  themes,
  ThemeStore
} from "@src/core/themes";
import { DynamicStatusBar } from "@src/components/common";
import { DEFAULT_THEME } from "@src/config";
// import { trackScreenTransition } from '@src/core/analytics';

import { Router } from "@src/core/navigation";

const images: ImageRequireSource[] = [
  require("./assets/images/source/splash.jpg")
];

const fonts: IFonts = {
  "inter-black": require("./assets/fonts/Inter-Black.ttf"),
  "inter-extrabold": require("./assets/fonts/Inter-ExtraBold.ttf"),
  "inter-bold": require("./assets/fonts/Inter-Bold.ttf"),
  "inter-regular": require("./assets/fonts/Inter-Regular.ttf"),
  "lexend-deca": require("./assets/fonts/LexendDeca-Regular.ttf")
};

const assets: IAssets = {
  images,
  fonts
};

const TempStatusbar = ({ currentTheme }: any) => {
  useEffect(() => {
    console.log("router!");
  }, []);

  return (
    <>
      <DynamicStatusBar currentTheme={currentTheme} />
    </>
  );
};

// const onTransitionTrackError = (error: any): void => {
//   console.warn('Analytics error: ', error.message);
// };

const App = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(DEFAULT_THEME);

  const toggleTheme = (theme: ThemeKey) => {
    ThemeStore.setTheme(theme).then(() => {
      setCurrentTheme(theme); // Update state
    });
  };

  const contextValue: ThemeContextType = {
    currentTheme,
    toggleTheme
  };

  console.log("Theme: ", currentTheme);
  return (
    <ApplicationLoader assets={assets}>
      <ThemeContext.Provider value={contextValue}>
        <ApplicationProvider mapping={mapping} theme={themes[currentTheme]}>
          <TempStatusbar />

          <Router
          // onStateChange={(state: any) =>
          //   console.log('NAVIGATION', JSON.stringify(state, null, 2))
          // }
          />
        </ApplicationProvider>
      </ThemeContext.Provider>
    </ApplicationLoader>
  );
};

export default App;
