export const theme = {
  colors: {
    primary: 'var(--bs-primary)', // Hauptfarbe (Blau)
    primaryHover: 'var(--bs-primary-hover)',
    secondary: 'var(--bs-secondary)', // Sekundärfarbe (Grau)
    success: 'var(--bs-success)', // Erfolgsfarbe (Grün)
    successHover: 'var(--bs-success-hover)',
    warning: 'var(--bs-warning)', // Warnfarbe (Orange)
    danger: 'var(--bs-danger)', // Gefahrenfarbe (Rot)
    background: {
      light: 'var(--background)',
      dark: 'var(--background)',
    },
    text: {
      light: 'var(--foreground)',
      dark: 'var(--foreground)',
    },
    border: 'var(--bs-border)',
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