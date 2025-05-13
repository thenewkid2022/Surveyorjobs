export const theme = {
  colors: {
    primary: '#2563eb', // Hauptfarbe (Blau)
    secondary: '#64748b', // Sekundärfarbe (Grau)
    success: '#22c55e', // Erfolgsfarbe (Grün)
    warning: '#f59e0b', // Warnfarbe (Orange)
    danger: '#ef4444', // Gefahrenfarbe (Rot)
    background: {
      light: '#ffffff',
      dark: '#0a0a0a',
    },
    text: {
      light: '#171717',
      dark: '#ededed',
    },
    border: '#e2e8f0',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
  typography: {
    fontFamily: {
      sans: 'var(--font-geist-sans)',
      mono: 'var(--font-geist-mono)',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
} as const;

export type Theme = typeof theme; 