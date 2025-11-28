import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const DEFAULT_THEME = 'vheart';

const THEME_DEFINITIONS = {
  vheart: {
    id: 'vheart',
    label: 'Vheart Glow',
    icon: 'bi-heart-fill',
    variables: {
      '--color-bg': '#fff5f7',
      '--color-surface': '#ffffff',
      '--color-text': '#4c0519',
      '--color-muted': 'rgba(76, 5, 25, 0.65)',
      '--color-border': 'rgba(244, 63, 94, 0.25)',
      '--color-accent': '#f43f5e',
      '--color-accent-contrast': '#ffffff',
      '--color-accent-soft': '#ffe4e6'
    }
  },
  light: {
    id: 'light',
    label: 'Daylight',
    icon: 'bi-brightness-high',
    variables: {
      '--color-bg': '#f8fafc',
      '--color-surface': '#ffffff',
      '--color-text': '#0f172a',
      '--color-muted': 'rgba(15, 23, 42, 0.65)',
      '--color-border': 'rgba(15, 23, 42, 0.08)',
      '--color-accent': '#2563eb',
      '--color-accent-contrast': '#ffffff',
      '--color-accent-soft': '#dbeafe'
    }
  },
  dark: {
    id: 'dark',
    label: 'Midnight',
    icon: 'bi-moon-stars',
    variables: {
      '--color-bg': '#0f172a',
      '--color-surface': '#1e293b',
      '--color-text': '#e2e8f0',
      '--color-muted': 'rgba(226, 232, 240, 0.7)',
      '--color-border': 'rgba(226, 232, 240, 0.12)',
      '--color-accent': '#38bdf8',
      '--color-accent-contrast': '#0f172a',
      '--color-accent-soft': 'rgba(56, 189, 248, 0.16)'
    }
  }
};

const ORDERED_THEMES = Object.keys(THEME_DEFINITIONS);

const ThemeContext = createContext();

const sanitizeTheme = (name) => ORDERED_THEMES.includes(name) ? name : DEFAULT_THEME;

const applyThemeVariables = (themeKey) => {
  if (typeof document === 'undefined') return;
  const config = THEME_DEFINITIONS[sanitizeTheme(themeKey)];
  document.documentElement.setAttribute('data-theme', config.id);
  Object.entries(config.variables).forEach(([token, value]) => {
    document.documentElement.style.setProperty(token, value);
  });
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return DEFAULT_THEME;
    const savedTheme = window.localStorage.getItem('theme');
    return sanitizeTheme(savedTheme || DEFAULT_THEME);
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyThemeVariables(theme);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const cycleTheme = () => {
    setTheme((prev) => {
      const index = ORDERED_THEMES.indexOf(prev);
      const nextIndex = (index + 1) % ORDERED_THEMES.length;
      return ORDERED_THEMES[nextIndex];
    });
  };

  const setThemeByName = (name) => setTheme(sanitizeTheme(name));

  const availableThemes = useMemo(
    () => ORDERED_THEMES.map((key) => ({
      id: key,
      label: THEME_DEFINITIONS[key].label,
      icon: THEME_DEFINITIONS[key].icon
    })),
    []
  );

  const value = {
    theme,
    themeConfig: THEME_DEFINITIONS[theme],
    toggleTheme: cycleTheme,
    setTheme: setThemeByName,
    availableThemes,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
