import { useEffect, useState } from 'react';

const NAMES = ['accent', 'muted', 'border', 'real', 'card', 'text'] as const;
export type ThemeColors = Record<(typeof NAMES)[number], string>;

function readColors(): ThemeColors {
  const style = getComputedStyle(document.documentElement);
  return Object.fromEntries(NAMES.map(name => [name, style.getPropertyValue(`--${name}`).trim()])) as ThemeColors;
}

/**
 * Kolory z CSS (zmienne --accent itd.) dla bibliotek, które potrzebują ich jako wartości,
 * np. wykresu SVG. Odświeża się po przełączeniu jasnego/ciemnego motywu.
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
