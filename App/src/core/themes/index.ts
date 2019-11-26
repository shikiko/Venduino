import { ThemeType } from '@kitten/theme';

import appTheme from './app.theme.json';
import { dark, light, night, textStyle } from './styles';

interface ThemeRegistry {
  ['Light']: ThemeType;
  ['Dark']: ThemeType;
  ['Night']: ThemeType;
}

export type ThemeKey = keyof ThemeRegistry;

export const themes: ThemeRegistry = {
  Light: light,
  Dark: dark,
  Night: night,
};

export { ThemeContext, ThemeContextType } from './context';

export { ThemeStore } from './store';
export { ThemeService } from './service';

export { textStyle };
