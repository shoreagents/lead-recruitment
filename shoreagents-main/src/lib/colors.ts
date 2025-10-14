// Color palette definitions for ShoreAgents website

export const colors = {
  lime: {
    50: '#f7fee7',   // Lightest lime, backgrounds
    100: '#ecfccb',  // Very light lime, subtle accents
    200: '#d9f99d',  // Light lime, hover states
    300: '#bef264',  // Medium light lime, secondary buttons
    400: '#a3e635',  // Medium lime, active states
    500: '#84cc16',  // Primary lime green - Main brand color
    600: '#65a30d',  // Dark lime, hover states
    700: '#4d7c0f',  // Darker lime, pressed states
    800: '#365314',  // Very dark lime, borders
    900: '#1a2e05',  // Darkest lime, text on light backgrounds
  },
  ocean: {
    50: '#eff6ff',   // Lightest blue, backgrounds
    100: '#dbeafe',  // Very light blue, subtle accents
    200: '#bfdbfe',  // Light blue, hover states
    300: '#93c5fd',  // Medium light blue, secondary elements
    400: '#60a5fa',  // Medium blue, active states
    500: '#3b82f6',  // Primary ocean blue - Secondary brand color
    600: '#2563eb',  // Dark blue, hover states
    700: '#1d4ed8',  // Darker blue, pressed states
    800: '#1e40af',  // Very dark blue, borders
    900: '#1e3a8a',  // Darkest blue, text on light backgrounds
  },
  energy: {
    50: '#fff7ed',   // Lightest orange, backgrounds
    100: '#ffedd5',  // Very light orange, subtle accents
    200: '#fed7aa',  // Light orange, hover states
    300: '#fdba74',  // Medium light orange, secondary elements
    400: '#fb923c',  // Medium orange, active states
    500: '#f97316',  // Primary energy orange - Accent color
    600: '#ea580c',  // Dark orange, hover states
    700: '#c2410c',  // Darker orange, pressed states
    800: '#9a3412',  // Very dark orange, borders
    900: '#7c2d12',  // Darkest orange, text on light backgrounds
  },
} as const;

// Type definitions for better TypeScript support
export type LimeColor = keyof typeof colors.lime;
export type OceanColor = keyof typeof colors.ocean;
export type EnergyColor = keyof typeof colors.energy;

// Helper function to get color values
export const getColor = (palette: keyof typeof colors, shade: string) => {
  return colors[palette][shade as unknown as keyof typeof colors[typeof palette]] || colors[palette][500];
};

// Common color combinations
export const colorCombinations = {
  primary: {
    main: colors.lime[500],
    light: colors.lime[100],
    dark: colors.lime[700],
    contrast: colors.lime[900],
  },
  secondary: {
    main: colors.ocean[500],
    light: colors.ocean[100],
    dark: colors.ocean[700],
    contrast: colors.ocean[900],
  },
  accent: {
    main: colors.energy[500],
    light: colors.energy[100],
    dark: colors.energy[700],
    contrast: colors.energy[900],
  },
  background: {
    primary: colors.lime[50],
    secondary: colors.ocean[50],
    accent: colors.energy[50],
  },
  text: {
    primary: colors.lime[900],
    secondary: colors.ocean[900],
    accent: colors.energy[900],
    onLight: colors.lime[900],
    onDark: colors.lime[50],
  },
  border: {
    primary: colors.lime[200],
    secondary: colors.ocean[200],
    accent: colors.energy[200],
  },
} as const;




