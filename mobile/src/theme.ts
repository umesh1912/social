// Design tokens ported from "Duo App v3" (Claude Design) and the shadcn/ui slate palette.

export type Mode = 'personal' | 'work';

/** A CSS-style linear gradient: angle in degrees (CSS convention) + color stops. */
export type Grad = { angle: number; colors: readonly [string, string, ...string[]]; locations?: readonly [number, number, ...number[]] };

export type Theme = {
  accent: string;
  grad: Grad;
  tint: string;
  soft: string;
  shadow: string;
};

export const slate = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
};

export const PINK = '#db4e66';
export const PLUM = '#a24688';
export const INDIGO = '#4e3aba';
export const RED = '#ef4444';

export const TH: Record<Mode, Theme> = {
  personal: { accent: PINK, grad: { angle: 135, colors: [PINK, PLUM] }, tint: '#fdf2f4', soft: '#fce7eb', shadow: 'rgba(219,78,102,.35)' },
  work: { accent: INDIGO, grad: { angle: 135, colors: [PLUM, INDIGO] }, tint: '#f3f1fc', soft: '#e4e0f7', shadow: 'rgba(78,58,186,.35)' },
};

/** Theme used for "Everyone" posts in the composer. */
export const BOTH: Theme = { accent: PLUM, grad: { angle: 90, colors: [PINK, PLUM, INDIGO] }, tint: '#fdf2f4', soft: '#f5e6f0', shadow: 'rgba(162,70,136,.35)' };

export const G = {
  brand: { angle: 135, colors: [PINK, PLUM, INDIGO], locations: [0, 0.5, 1] } as Grad,
  brand90: { angle: 90, colors: [PINK, PLUM, INDIGO] } as Grad,
  brand160: { angle: 160, colors: [PINK, PLUM, INDIGO], locations: [0, 0.5, 1] } as Grad,
  personal90: { angle: 90, colors: [PINK, PLUM] } as Grad,
  work90: { angle: 90, colors: [PLUM, INDIGO] } as Grad,
  work135: { angle: 135, colors: [PLUM, INDIGO] } as Grad,
  personal135: { angle: 135, colors: [PINK, PLUM] } as Grad,
  workCard: { angle: 150, colors: [PLUM, INDIGO], locations: [0, 0.7] } as Grad,
  textBrand: { angle: 90, colors: [PINK, INDIGO] } as Grad,
};

/** Convert a CSS gradient angle to expo-linear-gradient start/end points (box-relative). */
export function gradPoints(angle: number) {
  const r = (angle * Math.PI) / 180;
  const dx = Math.sin(r);
  const dy = -Math.cos(r);
  // Scale so the line touches the box corners the way CSS does for 45° multiples.
  const k = 0.5 / Math.max(Math.abs(dx), Math.abs(dy));
  return {
    start: { x: 0.5 - dx * k, y: 0.5 - dy * k },
    end: { x: 0.5 + dx * k, y: 0.5 + dy * k },
  };
}

/** Fonts: Plus Jakarta Sans, one family per weight (React Native can't synthesize weights). */
export const FONT: Record<400 | 500 | 600 | 700 | 800, string> = {
  400: 'PlusJakartaSans_400Regular',
  500: 'PlusJakartaSans_500Medium',
  600: 'PlusJakartaSans_600SemiBold',
  700: 'PlusJakartaSans_700Bold',
  800: 'PlusJakartaSans_800ExtraBold',
};

/** CSS `letter-spacing: Nem` → points. */
export const em = (n: number, size: number) => n * size;

/** Status bar height inside the iOS frame the design was drawn in. Paddings in the design are relative to it. */
export const DESIGN_STATUS = 54;
