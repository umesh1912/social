// Primitives shared by every screen: text, icons, gradients, images and the shadcn/ui pieces the design uses.
import MaskedView from '@react-native-masked-view/masked-view';
import { Image, type ImageStyle } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Award, Bell, Bookmark, Briefcase, Calendar, Check, CheckCheck, ChevronLeft, Eye, EyeOff, Globe, GraduationCap, Hand, Heart, House,
  Image as ImageIcon, LocateFixed, Lock, MapPin, MessageCircle, Mic, MicOff, Navigation, Phone, PhoneIncoming, PhoneMissed, PhoneOff,
  PhoneOutgoing, Plus, Search, Send, ShieldCheck, ThumbsUp, Users, Video, X, type LucideIcon,
} from 'lucide-react-native';
import React from 'react';
import {
  Platform, Pressable, StyleSheet, Text, View, type ImageSourcePropType, type PressableProps, type StyleProp, type TextProps, type TextStyle, type ViewStyle,
} from 'react-native';
import { FONT, gradPoints, slate, type Grad } from '../theme';

// ── Text ────────────────────────────────────────────────────────────
type Weight = 400 | 500 | 600 | 700 | 800;
export type TxtProps = TextProps & { size?: number; w?: Weight; color?: string; lh?: number; ls?: number; center?: boolean };

/** Text in Plus Jakarta Sans. `lh` is a CSS-style unitless line-height; `ls` is letter-spacing in em. */
export function Txt({ size = 14, w = 400, color = slate[900], lh, ls, center, style, ...rest }: TxtProps) {
  return (
    <Text
      {...rest}
      style={[
        { fontFamily: FONT[w], fontSize: size, color },
        lh != null && { lineHeight: Math.round(size * lh) },
        ls != null && { letterSpacing: ls * size },
        center && { textAlign: 'center' },
        style,
      ]}
    />
  );
}

// ── Icons (shadcn/ui icon names → Lucide) ────────────────────────────
const ICONS = {
  IconAward: Award, IconBell: Bell, IconBookmark: Bookmark, IconBriefcase: Briefcase, IconCalendar: Calendar, IconCheck: Check,
  IconCheckCheck: CheckCheck, IconChevronLeft: ChevronLeft, IconEye: Eye, IconEyeOff: EyeOff, IconGlobe: Globe,
  IconGraduationCap: GraduationCap, IconHand: Hand, IconHeart: Heart, IconHome: House, IconImage: ImageIcon,
  IconLocateFixed: LocateFixed, IconLock: Lock, IconMapPin: MapPin, IconMessageCircle: MessageCircle, IconMic: Mic,
  IconMicOff: MicOff, IconNavigation: Navigation, IconPhone: Phone, IconPhoneIncoming: PhoneIncoming, IconPhoneMissed: PhoneMissed,
  IconPhoneOff: PhoneOff, IconPhoneOutgoing: PhoneOutgoing, IconPlus: Plus, IconSearch: Search, IconSend: Send,
  IconShieldCheck: ShieldCheck, IconThumbsUp: ThumbsUp, IconUsers: Users, IconVideo: Video, IconX: X,
} satisfies Record<string, LucideIcon>;
export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 16, color = slate[900] }: { name: IconName; size?: number; color?: string }) {
  const C = ICONS[name];
  return <C size={size} color={color} strokeWidth={2} />;
}

// ── Gradients ───────────────────────────────────────────────────────
export function Gradient({ g, style, children, pointerEvents }: { g: Grad; style?: StyleProp<ViewStyle>; children?: React.ReactNode; pointerEvents?: ViewStyle['pointerEvents'] }) {
  const { start, end } = gradPoints(g.angle);
  return (
    <LinearGradient colors={g.colors} locations={g.locations} start={start} end={end} style={[style, pointerEvents ? { pointerEvents } : null]}>
      {children}
    </LinearGradient>
  );
}

/** Vertical fade, used for photo scrims: `stops` are [color, location] pairs. */
export function Scrim({ stops, style }: { stops: [string, number][]; style?: StyleProp<ViewStyle> }) {
  return (
    <LinearGradient
      colors={stops.map(s => s[0]) as unknown as [string, string]}
      locations={stops.map(s => s[1]) as unknown as [number, number]}
      style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }, style]}
    />
  );
}

/** Gradient-filled text (CSS background-clip:text). Falls back to the first stop on web. */
export function GradientText({ g, children, ...txt }: TxtProps & { g: Grad }) {
  if (Platform.OS === 'web') return <Txt {...txt} color={g.colors[0]}>{children}</Txt>;
  return (
    <MaskedView maskElement={<Txt {...txt}>{children}</Txt>}>
      <Gradient g={g}>
        <Txt {...txt} style={[txt.style, { opacity: 0 }]}>{children}</Txt>
      </Gradient>
    </MaskedView>
  );
}

// ── Images ──────────────────────────────────────────────────────────
export type Src = ImageSourcePropType | string | null | undefined;
/** A cover-fit photo. `style` sizes the frame (any view style, incl. borders and shadows); the photo fills it. */
export function Img({ src, style }: { src: Src; style?: StyleProp<ViewStyle> }) {
  const flat = StyleSheet.flatten(style) || {};
  const inner: ImageStyle = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: Math.max(0, (Number(flat.borderRadius) || 0) - (Number(flat.borderWidth) || 0)) };
  const source = typeof src === 'string' ? { uri: src } : (src as never);
  return (
    <View style={[{ backgroundColor: slate[200] }, style]}>
      {src ? <Image source={source} style={inner} contentFit="cover" transition={150} /> : null}
    </View>
  );
}

/** shadcn/ui Avatar: round, gray placeholder with initials when there is no photo. */
export function Avatar({ src, initials, size = 40, style }: { src?: Src; initials?: string; size?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', backgroundColor: '#d9d9d9', alignItems: 'center', justifyContent: 'center' }, style]}>
      {src ? <Img src={src} style={{ width: size, height: size }} /> : <Txt size={14} color="#000">{initials ?? 'CN'}</Txt>}
    </View>
  );
}

// ── Pressable with web hover + press feedback ───────────────────────
export type BtnProps = Omit<PressableProps, 'style'> & { style?: StyleProp<ViewStyle>; hoverBg?: string };
export function Btn({ style, hoverBg, children, ...rest }: BtnProps) {
  return (
    <Pressable
      accessibilityRole="button"
      {...rest}
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => [
        style,
        hovered && hoverBg ? { backgroundColor: hoverBg } : null,
        pressed ? { opacity: 0.75 } : null,
      ]}
    >
      {children}
    </Pressable>
  );
}

/** shadcn/ui Button — only the variants the design uses. */
export function DSButton({ variant = 'ghost', label, children, style, textStyle, ...rest }: BtnProps & { variant?: 'ghost' | 'outline'; label?: string; textStyle?: StyleProp<TextStyle> }) {
  return (
    <Btn
      {...rest}
      hoverBg={variant === 'ghost' ? slate[100] : slate[50]}
      style={[
        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, minHeight: 40 },
        variant === 'outline' && { backgroundColor: '#fff', boxShadow: `inset 0 0 0 1px ${slate[200]}` },
        style,
      ]}
    >
      {label != null ? <Txt size={14} w={500} lh={24 / 14} style={textStyle}>{label}</Txt> : children}
    </Btn>
  );
}

/** shadcn/ui Switch (44×24 track as drawn in the Figma file). */
export function DSSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable accessibilityRole="switch" accessibilityState={{ checked }} onPress={() => onChange(!checked)} hitSlop={8}>
      <View style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: checked ? slate[200] : '#d9d9d9' }}>
        <View style={{ position: 'absolute', top: 2, left: checked ? 22 : 2, width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', boxShadow: '0 1px 2px rgba(15,23,42,.15)' }} />
      </View>
    </Pressable>
  );
}

/** Rounded pill chip, used for small labels over photos. */
export function Chip({ children, bg, style }: { children: React.ReactNode; bg: string; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ height: 24, paddingHorizontal: 9, borderRadius: 40, backgroundColor: bg, flexDirection: 'row', alignItems: 'center', gap: 4 }, style]}>{children}</View>;
}

export const fill: ViewStyle = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 };
export const row: ViewStyle = { flexDirection: 'row', alignItems: 'center' };
export const center: ViewStyle = { alignItems: 'center', justifyContent: 'center' };
