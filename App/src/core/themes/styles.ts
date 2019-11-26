import { light as lightTheme, dark as darkTheme } from '@eva-design/eva';

const commonTheme = {
  'text-font-family': 'inter-regular',
  'color-primary-100': '#E8E6FF',
  'color-primary-200': '#D1CCFF',
  'color-primary-300': '#BBB3FF',
  'color-primary-400': '#A599FF',
  'color-primary-500': '#7C6CFF',
  'color-primary-600': '#7266CC',
  'color-primary-700': '#554D99',
  'color-primary-800': '#393366',
  'color-primary-900': '#1C1A33',
  'color-primary-transparent-100': 'rgba(124, 108, 255, 0.08)',
  'color-primary-transparent-200': 'rgba(124, 108, 255, 0.16)',
  'color-primary-transparent-300': 'rgba(124, 108, 255, 0.24)',
  'color-primary-transparent-400': 'rgba(124, 108, 255, 0.32)',
  'color-primary-transparent-500': 'rgba(124, 108, 255, 0.4)',
  'color-primary-transparent-600': 'rgba(124, 108, 255, 0.48)',
};

export const light = {
  ...lightTheme,
  ...commonTheme,
  'color-basic-600': 'rgba(0, 0, 0, 0.5)',
};

export const dark = {
  ...darkTheme,
  ...commonTheme,
  'color-basic-600': 'rgba(255, 255, 255, 0.5)',
  'color-basic-800': '#101014',
  'color-basic-900': '#343238',
  'color-basic-1000': '#1C1C23',
  'color-basic-1100': '#343238',
  'background-basic-color-1': '$color-basic-1000', // <- 800 by default BG
  'background-basic-color-2': '$color-basic-1100', // <- 900 by default MAIN BG
  'background-basic-color-3': '$color-basic-900', // <- etc
  'background-basic-color-4': '$color-basic-800',
};

export const night = {
  ...darkTheme,
  ...commonTheme,
};

export const textStyle = {
  h1: {
    fontFamily: 'inter-black',
    fontWeight: 'normal',
    fontSize: 32,
  },
  h2: {
    fontFamily: 'inter-black',
    fontWeight: 'normal',
    fontSize: 24,
  },
  h3: {
    fontFamily: 'inter-extrabold',
    fontWeight: 'normal',
    fontSize: 18,
  },
  paragraph: {
    fontFamily: 'inter-regular',
    fontWeight: 'normal',
  },
  label: {
    fontFamily: 'inter-bold',
    fontWeight: 'normal',
  },
  action: {
    fontFamily: 'lexend-deca',
    fontWeight: 'normal',
    // fontSize: 18,
  },
  actionSmall: {
    fontFamily: 'lexend-deca',
    fontWeight: 'normal',
    // fontSize: 14,
  },
  actionTiny: {
    fontFamily: 'inter-bold',
    fontWeight: 'normal',
    // fontSize: 12,
  },
  number: {
    fontFamily: 'lexend-deca',
    fontWeight: 'normal',
    fontSize: 24,
  },
  numberSmall: {
    fontFamily: 'lexend-deca',
    fontWeight: 'normal',
    fontSize: 16,
  },
};
