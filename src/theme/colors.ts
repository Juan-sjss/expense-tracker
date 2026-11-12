export const colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F3F4F6',
    text: '#111827',
    textMuted: '#6B7280',
    primary: '#2563EB',
  },
  dark: {
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textMuted: '#9CA3AF',
    primary: '#3B82F6',
  },
} as const;

export type ThemeMode = 'light' | 'dark';
