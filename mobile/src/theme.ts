import { useColorScheme } from 'react-native';

/**
 * Servhive's look on mobile: the website's warm neutrals, ink text and the
 * brand orange (logo green appears only in the logo). Light and dark palettes
 * share the same token names, so screens never hard-code a colour.
 */

const light = {
  bg: '#f7f5f1',
  surface: '#ffffff',
  surface2: '#efebe4',
  border: '#e4ded4',
  text: '#17130f',
  muted: '#6f675e',
  faint: '#a39a8f',
  accent: '#e8720c',
  accentText: '#ffffff',
  accentSoft: '#fdecd9',
  success: '#1f8a52',
  successSoft: '#dcf1e4',
  info: '#2563a8',
  infoSoft: '#dde9f7',
  danger: '#c2410c',
  dangerSoft: '#fbe3d6',
  overlay: 'rgba(23,19,15,0.45)',
};

const dark: typeof light = {
  bg: '#12100d',
  surface: '#1c1915',
  surface2: '#26221d',
  border: '#332d26',
  text: '#f4efe8',
  muted: '#aaa196',
  faint: '#776f66',
  accent: '#f5953e',
  accentText: '#1a1007',
  accentSoft: '#3a2814',
  success: '#55c28a',
  successSoft: '#163223',
  info: '#7fb0ea',
  infoSoft: '#172a40',
  danger: '#f08a5d',
  dangerSoft: '#3a1d10',
  overlay: 'rgba(0,0,0,0.6)',
};

export type Palette = typeof light;
export const palettes = { light, dark };

export function useColors(): Palette {
  return useColorScheme() === 'dark' ? dark : light;
}

/** Instrument Sans, the website's typeface (loaded in the root layout). */
export const fonts = {
  regular: 'InstrumentSans_400Regular',
  medium: 'InstrumentSans_500Medium',
  semibold: 'InstrumentSans_600SemiBold',
  bold: 'InstrumentSans_700Bold',
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 8, md: 12, lg: 18, pill: 999 } as const;
