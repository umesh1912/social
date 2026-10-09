// App chrome: header, floating tab bar with the mode orb, the colour wipe, toast and the "jump to screen" sheet.
import { BlurView } from 'expo-blur';
import { usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Easing, Modal, Platform, Pressable, ScrollView, View, useWindowDimensions, type LayoutChangeEvent } from 'react-native';
import { A, CHATS } from '../data';
import { JUMPS, useDuo, type Tab } from '../store';
import { G, slate, TH } from '../theme';
import { useDesignInsets } from './insets';
import { Avatar, Btn, Gradient, Icon, Txt, center, fill, row, type IconName } from './ui';

const TITLES: Record<Tab, (w: boolean) => string> = {
  index: w => (w ? 'Your network' : 'Your people'),
  chats: () => 'Chats',
  groups: () => 'Groups',
  jobs: () => 'Opportunities',
  profile: () => 'Profile',
  nearby: () => 'Around you',
};

const roundBtn = { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', ...center, boxShadow: '0 1px 2px rgba(15,23,42,.08)' } as const;

export function TopBar({ tab }: { tab: Tab }) {
  const { s, a } = useDuo();
  const ins = useDesignInsets();
  const T = TH[s.mode];
  const isW = s.mode === 'work';
  const [jumpOpen, setJumpOpen] = useState(false);
  return (
    <View style={[row, { paddingTop: ins.top(58), paddingHorizontal: 16, paddingBottom: 10, gap: 10, backgroundColor: T.tint }]}>
      <Pressable style={{ flex: 1, gap: 1 }} onLongPress={() => setJumpOpen(true)} delayLongPress={450} accessibilityHint="Long press to jump to any screen">
        <View style={[row, { gap: 6 }]}>
          <View style={{ width: 7, height: 7, borderRadius: 9, backgroundColor: T.accent }} />
          <Txt size={11} w={600} color={T.accent}>{isW ? 'Work space' : 'Personal space'}</Txt>
        </View>
        <Txt size={22} w={800} ls={-0.025}>{TITLES[tab](isW)}</Txt>
      </Pressable>
      <Btn onPress={a.openDiscover} accessibilityLabel="Search" style={roundBtn}>
        <Icon name="IconSearch" size={19} />
      </Btn>
      <Btn onPress={a.openNotifs} accessibilityLabel="Notifications" style={roundBtn}>
        <Icon name="IconBell" size={19} />
        {!s.notifsSeen && (
          <Gradient g={T.grad} style={{ position: 'absolute', top: -2, right: -2, minWidth: 18, height: 18, paddingHorizontal: 5, borderRadius: 40, ...center, boxShadow: '0 0 0 2px #fff' }}>
            <Txt size={10} w={700} color="#fff">4</Txt>
          </Gradient>
        )}
      </Btn>
      <Btn onPress={() => a.goTab('profile')} accessibilityLabel="Profile" style={{ width: 40, height: 40, borderRadius: 20, boxShadow: `0 0 0 2px ${tab === 'profile' ? T.accent : '#fff'}` }}>
        <Avatar src={A.me} size={40} />
      </Btn>
      <JumpSheet open={jumpOpen} onClose={() => setJumpOpen(false)} />
    </View>
  );
}

type TabDef = { id: Tab; icon: IconName; label: string };

export function TabBar({ active, onPress }: { active: Tab; onPress: (t: Tab) => void }) {
  const { s, a } = useDuo();
  const ins = useDesignInsets();
  const T = TH[s.mode];
  const isW = s.mode === 'work';
  const unread = [...CHATS, ...s.extraChats].filter(c => c.mode === s.mode && c.unread && !s.read[c.id]).length;

  const left: TabDef[] = [{ id: 'index', icon: 'IconHome', label: 'Home' }, { id: 'chats', icon: 'IconMessageCircle', label: 'Chats' }];
  const right: TabDef[] = [
    { id: 'nearby', icon: 'IconMapPin', label: 'Nearby' },
    isW ? { id: 'jobs', icon: 'IconBriefcase', label: 'Jobs' } : { id: 'groups', icon: 'IconUsers', label: 'Groups' },
  ];
  const item = (t: TabDef) => {
    const on = active === t.id;
    const color = on ? T.accent : slate[400];
    return (
      <Btn key={t.id} onPress={() => onPress(t.id)} accessibilityLabel={t.label} accessibilityState={{ selected: on }} style={{ flex: 1, height: 56, ...center, gap: 3 }}>
        <Icon name={t.icon} size={22} color={color} />
        <Txt size={10} w={on ? 700 : 500} color={color}>{t.label}</Txt>
        {t.id === 'chats' && unread > 0 && (
          <View style={{ position: 'absolute', top: 4, left: '50%', marginLeft: 6 }}>
            <Gradient g={T.grad} style={{ minWidth: 17, height: 17, paddingHorizontal: 4, borderRadius: 40, ...center }}>
              <Txt size={10} w={700} color="#fff">{unread}</Txt>
            </Gradient>
          </View>
        )}
      </Btn>
    );
  };

  return (
    <View style={{ position: 'absolute', left: 14, right: 14, bottom: ins.tabBarBottom, height: 68, borderRadius: 40, boxShadow: `0 8px 28px rgba(15,23,42,.14)`, zIndex: 2 }}>
      <View style={[fill, { borderRadius: 40, overflow: 'hidden' }]}>
        {Platform.OS === 'ios' ? <BlurView intensity={40} tint="light" style={fill} /> : null}
        <View style={[fill, { backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.94)', borderRadius: 40, boxShadow: `inset 0 0 0 1px ${slate[200]}` }]} />
      </View>
      <View style={[row, { flex: 1, paddingHorizontal: 8 }]}>
        {left.map(item)}
        <Pressable onPress={a.toggleMode} accessibilityLabel="Switch space" style={{ width: 62, height: 62, marginTop: -26, borderRadius: 31, boxShadow: `0 8px 20px ${T.shadow}, 0 0 0 5px #fff` }}>
          <Gradient g={T.grad} style={{ flex: 1, borderRadius: 31, ...center, gap: 1 }}>
            <Icon name={isW ? 'IconBriefcase' : 'IconHeart'} size={22} color="#fff" />
            <Txt size={9} w={700} ls={0.04} color="#fff">{isW ? 'WORK' : 'PERSONAL'}</Txt>
          </Gradient>
        </Pressable>
        {right.map(item)}
      </View>
    </View>
  );
}

/** The circular colour wipe played when switching spaces (CSS: duoWipe + duoLabel, 0.9s). */
export function ModeWipe() {
  const { s } = useDuo();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const r = useState(() => new Animated.Value(0))[0];
  const op = useState(() => new Animated.Value(0))[0];
  const label = useState(() => new Animated.Value(0))[0];
  // The wipe is showing while its key is ahead of the last finished one.
  const [doneKey, setDoneKey] = useState(0);
  const shown = s.wipeKey > doneKey;

  useEffect(() => {
    if (!s.wipeKey) return;
    const key = s.wipeKey;
    r.setValue(0); op.setValue(1); label.setValue(0);
    const anim = Animated.parallel([
      Animated.sequence([
        Animated.timing(r, { toValue: 1, duration: 405, easing: Easing.bezier(0.25, 0.1, 0.25, 1), useNativeDriver: false }),
        Animated.timing(op, { toValue: 0, duration: 495, easing: Easing.bezier(0.25, 0.1, 0.25, 1), useNativeDriver: false }),
      ]),
      Animated.timing(label, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: false }),
    ]);
    anim.start(({ finished }) => finished && setDoneKey(key));
    return () => anim.stop();
  }, [s.wipeKey, r, op, label]);

  const onLayout = (e: LayoutChangeEvent) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });
  const { w, h } = size;
  const cx = w / 2, cy = h * 0.94;
  const rMax = 1.5 * Math.sqrt((w * w + h * h) / 2);
  const rad = r.interpolate({ inputRange: [0, 1], outputRange: [0, rMax] });
  const T = TH[s.mode];
  const labelStyle = {
    opacity: label.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 1, 0] }),
    transform: [{ translateY: label.interpolate({ inputRange: [0, 0.4, 1], outputRange: [12, 0, 0] }) }],
  };

  return (
    <View style={[fill, { zIndex: 7, pointerEvents: 'none' }]} onLayout={onLayout}>
      {shown && w > 0 && (
        <Animated.View style={{ position: 'absolute', opacity: op, left: Animated.subtract(cx, rad), top: Animated.subtract(cy, rad), width: Animated.multiply(rad, 2), height: Animated.multiply(rad, 2), borderRadius: rad, overflow: 'hidden' }}>
          <Animated.View style={{ position: 'absolute', left: Animated.subtract(rad, cx), top: Animated.subtract(rad, cy), width: w, height: h }}>
            <Gradient g={T.grad} style={[fill, center, { gap: 6 }]}>
              <Animated.View style={labelStyle}><Txt size={12} w={600} color="rgba(255,255,255,.85)" center>Switching to</Txt></Animated.View>
              <Animated.View style={labelStyle}><Txt size={28} w={800} ls={-0.03} color="#fff" center>{s.mode === 'work' ? 'Work' : 'Personal'}</Txt></Animated.View>
            </Gradient>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

export function Toast() {
  const { s } = useDuo();
  if (!s.toast) return null;
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, bottom: 110, zIndex: 6, backgroundColor: slate[900], borderRadius: 40, paddingVertical: 12, paddingHorizontal: 18, boxShadow: '0 8px 20px rgba(15,23,42,.25)', pointerEvents: 'none' }}>
      <Txt size={13} w={600} color="#fff" center>{s.toast}</Txt>
    </View>
  );
}

function JumpButtons({ onPick }: { onPick?: () => void }) {
  const { a } = useDuo();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {JUMPS.map(([k, label]) => (
        <Btn key={k} hoverBg={slate[100]} onPress={() => { onPick?.(); a.jump(k); }} style={{ backgroundColor: '#fff', boxShadow: `inset 0 0 0 1px ${slate[200]}`, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 10 }}>
          <Txt size={12} w={500}>{label}</Txt>
        </Btn>
      ))}
    </View>
  );
}

/** Native stand-in for the prototype's side panel: long-press the screen title to open it. */
function JumpSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (Platform.OS === 'web') return null;
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(15,23,42,.35)' }} onPress={onClose} />
      <View style={{ backgroundColor: slate[50], borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40, gap: 12 }}>
        <Txt size={11} w={600} color={slate[500]}>Jump to screen</Txt>
        <JumpButtons onPick={onClose} />
      </View>
    </Modal>
  );
}

/** The prototype's presentation page: intro + jump panel beside a 402×874 iPhone frame (wide web only). */
export function SidePanel() {
  return (
    <View style={{ width: 290, maxWidth: '100%', gap: 22, paddingTop: 24 }}>
      <View style={{ gap: 10 }}>
        <View style={[row, { gap: 10 }]}>
          <Gradient g={G.brand} style={{ width: 34, height: 34, borderRadius: 96 }} />
          <Txt size={24} w={800} ls={-0.03}>Duo</Txt>
        </View>
        <Txt size={13} lh={1.55} color={slate[600]}>
          Two spaces in one app. Personal runs warm in pink, Work runs cool in indigo. The orb in the tab bar flips between them, and every screen, feed, chat list and profile follows.
        </Txt>
      </View>
      <View style={{ gap: 8 }}>
        <Txt size={11} w={600} color={slate[500]}>Jump to screen</Txt>
        <JumpButtons />
      </View>
      <Txt size={11} lh={1.5} color={slate[500]}>
        Photos are stock images standing in for user content. Swipe through Opportunities, flip your profile card, send messages, open stories.
      </Txt>
    </View>
  );
}

export function useWideWeb() {
  const { width } = useWindowDimensions();
  return Platform.OS === 'web' && width >= 760;
}

/** iPhone frame for the web presentation, matching ios-frame.jsx. */
export function DeviceFrame({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const dark = path === '/story' || path === '/call';
  const c = dark ? '#fff' : '#000';
  return (
    <View testID="device" style={{ width: 402, height: 874, borderRadius: 48, overflow: 'hidden', backgroundColor: dark ? '#000' : '#F2F2F7', boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)' }}>
      {children}
      <View style={{ position: 'absolute', top: 11, left: 138, width: 126, height: 37, borderRadius: 24, backgroundColor: '#000', zIndex: 50, pointerEvents: 'none' }} />
      <View style={[row, { position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 21, paddingHorizontal: 24, zIndex: 10, pointerEvents: 'none' }]}>
        <View style={{ flex: 1, height: 22, ...center }}><Txt size={17} w={600} color={c}>9:41</Txt></View>
        <View style={{ width: 154 }} />
        <View style={[row, { flex: 1, height: 22, justifyContent: 'center', gap: 7 }]}>
          <View style={[row, { gap: 1.6, alignItems: 'flex-end', height: 12 }]}>
            {[4.5, 7, 9.5, 12].map(hh => <View key={hh} style={{ width: 3.2, height: hh, borderRadius: 0.7, backgroundColor: c }} />)}
          </View>
          <View style={{ width: 25, height: 12, borderRadius: 3.5, borderWidth: 1, borderColor: dark ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.35)', padding: 1 }}>
            <View style={{ flex: 1, borderRadius: 2, backgroundColor: c }} />
          </View>
        </View>
      </View>
      <View style={{ position: 'absolute', bottom: 8, left: 131, width: 139, height: 5, borderRadius: 100, backgroundColor: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)', zIndex: 60, pointerEvents: 'none' }} />
    </View>
  );
}

export function PresentationPage({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: slate[50] }} contentContainerStyle={{ minHeight: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 56, justifyContent: 'center', alignItems: 'flex-start', paddingVertical: 40, paddingHorizontal: 24 }}>
      <SidePanel />
      <DeviceFrame>{children}</DeviceFrame>
    </ScrollView>
  );
}
