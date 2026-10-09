import type { LatLng, Meet, NearPerson } from '../../data';
import type { Theme } from '../../theme';

export type MapPerson = NearPerson & { src: string; waved: boolean };
export type MapMeet = Meet & { goingN: number };

export type NearbyMapProps = {
  theme: Theme;
  visible: boolean;
  filter: 'people' | 'meetups';
  people: MapPerson[];
  meets: MapMeet[];
  selected: string | null;
  recenterKey: number;
  onSelect: (id: string) => void;
};

/** Zoom 15 ≈ this span around Lake Merritt at phone width; zoom 16 is half of it. */
export const SPAN_15 = 0.012;
/** Selection flies to the pin, nudged north so it sits above the bottom card. */
export const SEL_OFFSET = 0.0012;

export const findLL = (p: NearbyMapProps, id: string | null): LatLng | null => {
  if (!id) return null;
  const it = [...p.people, ...p.meets].find(x => x.id === id);
  return it ? it.ll : null;
};
