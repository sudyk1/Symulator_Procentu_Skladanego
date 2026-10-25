import { useEffect, useState } from 'react';

const NAMES = ['accent', 'muted', 'border', 'real', 'compare', 'card', 'text'] as const;
export type ThemeColors = Record<(typeof NAMES)[number], string>;

function readColors(): ThemeColors {
  const style = getComputedStyle(document.documentElement);
  return Object.fromEntries(NAMES.map(name => [name, style.getPropertyValue(`--${name}`).trim()])) as ThemeColors;
}

/**
 * CSS colours (the --accent etc. variables) as plain values for libraries that need them,
 * e.g. the SVG chart. Refreshes when the light/dark theme changes.
 */
export function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState(readColors);
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setColors(readColors());
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return colors;
}
