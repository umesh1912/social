import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DESIGN_STATUS } from '../theme';

/**
 * The design was drawn inside an iOS frame whose status bar is ~54pt; top paddings like 58 or 56 are
 * relative to that. These helpers re-anchor them on the device's real safe area.
 */
export function useDesignInsets() {
  const i = useSafeAreaInsets();
  return {
    /** Convert a design top padding (e.g. 58) to one that clears this device's status bar. */
    top: (designPad: number) => i.top + (designPad - DESIGN_STATUS),
    /** Floating tab bar offset (26pt over a 34pt home indicator in the design). */
    tabBarBottom: i.bottom ? Math.max(i.bottom - 8, 12) : 16,
    /** Bottom padding for input bars that sit on the home indicator (design: 34–36). */
    bottom: (designPad: number) => (i.bottom ? i.bottom + (designPad - 34) : Math.max(designPad - 22, 12)),
    raw: i,
  };
}
