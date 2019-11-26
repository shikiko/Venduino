import { ThemeKey } from '@src/core/themes';

export class ThemeService {
  public static select = <T>(
    config: { [key in ThemeKey | 'default']?: T },
    currentTheme: ThemeKey,
  ): T | undefined => {
    if (config[currentTheme]) {
      return config[currentTheme];
    }
    if (config.default) {
      return config.default;
    }
    return undefined;
  };
}
