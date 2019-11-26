import AsyncStorage from '@react-native-community/async-storage';
import { ThemeKey } from '@src/core/themes';

import { STORAGE_THEME_KEY } from '@src/config';

class ThemeStoreType {
  public setTheme(name: ThemeKey): Promise<void> {
    return AsyncStorage.setItem(STORAGE_THEME_KEY, name);
  }

  public getTheme(): Promise<ThemeKey> {
    return AsyncStorage.getItem(STORAGE_THEME_KEY) as Promise<ThemeKey>;
  }
}

export const ThemeStore: ThemeStoreType = new ThemeStoreType();
