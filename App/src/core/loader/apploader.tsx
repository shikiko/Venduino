import React, { useState, useEffect } from "react";
import { ImageRequireSource } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { Asset } from "expo-asset";
import * as Font from "expo-font";

export interface IFonts {
  [key: string]: number;
}

export interface IAssets {
  images?: ImageRequireSource[];
  fonts?: IFonts;
}

interface Props {
  assets?: IAssets;
  children: React.ReactNode;
}

/**
 * Loads child component after asynchronous tasks are done
 */

const loadFonts = (fonts: { [key: string]: number }): Promise<void> => {
  return Font.loadAsync(fonts);
};

// TODO: Fix loading
// const loadImages = (images: ImageRequireSource[]): Promise<void>[] => {
//   const tasks: Promise<void>[] = images.map(
//     (image: ImageRequireSource): Promise<void> => {
//       return Asset.fromModule(image).downloadAsync();
//     },
//   );
//   return tasks;
// };

export const ApplicationLoader = ({ assets = {}, children }: Props) => {
  const [isLoaded, setLoaded] = useState<boolean>(false);

  // Load resources on load
  useEffect(() => {
    const loadResources = async () => {
      const tasks: Promise<void>[] = [];

      if (assets.fonts) tasks.push(loadFonts(assets.fonts));
      // if (assets.images) tasks.push(...loadImages(assets.images));

      await Promise.all(tasks);
      console.log("done loading resources");
      setLoaded(true);
    };

    loadResources();
    SplashScreen.hide();
  }, [assets]);

  if (isLoaded) return children as React.ReactNode;
  return <></>;
};
