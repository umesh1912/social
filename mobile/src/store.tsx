// App state for Duo. A port of the prototype's single stateful component; screens read from it
// via useDuo() and navigation goes through expo-router.
import { router, usePathname, type Href } from 'expo-router';
import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  A, CHATS, GROUPS, IMG, MEETS, MSGS, POSTS, REPLIES, CENTER, firstName, nowAt,
  type Audience, type Chat, type JobType, type Meet, type Msg, type NearPerson, type Post,
} from './data';
import type { Mode } from './theme';

/** Launch options — the prototype exposed these as props. */
export const START_MODE: Mode = 'personal';
export const SKIP_ONBOARDING = false;

type JobOutcome = 'skip' | 'apply' | 'save';
type Flags = Record<string, boolean>;

export type DuoState = {
  onboarding: boolean;
  step: number;
  mode: Mode;
  name: string; phone: string; role: string; company: string; workEmail: string;
  seen: Flags;
  storyLiked: Flags;
  chatTab: 'chats' | 'calls';
  posts: Post[];
  liked: Flags;
  saved: Flags;
  applied: Flags;
  gone: Record<string, JobOutcome>;
  jobFilter: 'All' | JobType;
  mentorReq: Flags;
  msgs: Record<string, Msg[]>;
  read: Flags;
  typing: string | null;
  nStatus: Record<string, string>;
  connected: Record<string, 'f' | 'c'>;
  notifsSeen: boolean;
  endorsed: boolean;
  mentorOpen: boolean;
  viewAs: 'friends' | 'colleagues' | null;
  wipeKey: number;
  toast: string;
  nearFilter: 'people' | 'meetups';
  nearSel: string | null;
  /** Bumped by "recenter" so the map flies back even when nothing is selected. */
  recenterKey: number;
  waved: Flags;
  joined: Flags;
  nearVis: Record<Mode, boolean>;
  myMeets: Record<Mode, Meet[]>;
  extraChats: Chat[];
};

const initialState = (): DuoState => ({
  onboarding: !SKIP_ONBOARDING, step: 0, mode: START_MODE,
  name: '', phone: '', role: '', company: '', workEmail: '',
  seen: {}, storyLiked: {}, chatTab: 'chats', posts: POSTS, liked: {}, saved: {}, applied: {}, gone: {}, jobFilter: 'All',
  mentorReq: {}, msgs: MSGS, read: {}, typing: null, nStatus: {}, connected: {}, notifsSeen: false, endorsed: false,
  mentorOpen: true, viewAs: null, wipeKey: 0, toast: '',
  nearFilter: 'people', nearSel: null, recenterKey: 0, waved: {}, joined: {}, nearVis: { personal: true, work: true },
  myMeets: { personal: [], work: [] }, extraChats: [],
});

type Patch = Partial<DuoState> | ((s: DuoState) => Partial<DuoState> | null);

export type JumpKey =
  | 'onboarding' | 'home' | 'story' | 'chats' | 'thread' | 'group' | 'calls' | 'nearby' | 'groups' | 'jobs'
  | 'compose' | 'notifs' | 'discover' | 'profile';
export const JUMPS: [JumpKey, string][] = [
  ['onboarding', 'Onboarding'], ['home', 'Home feed'], ['story', 'Story'], ['chats', 'Chats'], ['thread', 'Chat thread'],
  ['group', 'Group'], ['calls', 'Calls'], ['nearby', 'Nearby map'], ['groups', 'Groups'], ['jobs', 'Opportunities'],
  ['compose', 'Create post'], ['notifs', 'Activity'], ['discover', 'Discover'], ['profile', 'Profile'],
];

export type Tab = 'index' | 'chats' | 'nearby' | 'groups' | 'jobs' | 'profile';
const TAB_PATH: Record<Tab, string> = { index: '/', chats: '/chats', nearby: '/nearby', groups: '/groups', jobs: '/jobs', profile: '/profile' };
const isTabPath = (p: string) => Object.values(TAB_PATH).includes(p);

/** Mutable values the actions read at event time (latest state, current route, pending timers). */
type Box = { s: DuoState; path: string; timers: Set<ReturnType<typeof setTimeout>> };

function makeActions(box: Box, setS: React.Dispatch<React.SetStateAction<DuoState>>) {
  const get = () => box.s;
  const set = (p: Patch) => {
    setS(prev => {
      const patch = typeof p === 'function' ? p(prev) : p;
      if (!patch) return prev;
      const next = { ...prev, ...patch };
      box.s = next;
      return next;
    });
  };
  const timers = box.timers;
  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(() => { timers.delete(t); fn(); }, ms);
    timers.add(t);
  };
  let toastTimer: ReturnType<typeof setTimeout> | undefined;

  /** Pop any overlay screens so the tab navigator is on top. */
  const closeOverlays = () => {
    if (!isTabPath(box.path) && router.canDismiss()) router.dismissAll();
  };

  const a = {
    set,
    flash(t: string) {
      if (toastTimer) clearTimeout(toastTimer);
      set({ toast: t });
      toastTimer = setTimeout(() => set({ toast: '' }), 2200);
    },
    goTab(tab: Tab) {
      closeOverlays();
      router.navigate(TAB_PATH[tab] as Href);
    },
    setMode(m: Mode) {
      const s = get();
      if (m === s.mode) return;
      const path = box.path;
      set(st => ({ mode: m, viewAs: null, wipeKey: st.wipeKey + 1, typing: null }));
      closeOverlays();
      if (path === '/groups' && m === 'work') router.navigate('/jobs' as Href);
      if (path === '/jobs' && m === 'personal') router.navigate('/groups' as Href);
    },
    toggleMode() {
      a.setMode(get().mode === 'work' ? 'personal' : 'work');
    },
    openChat(id: string) {
      set(s => ({ read: { ...s.read, [id]: true } }));
      router.push(`/thread/${id}` as Href);
    },
    closeOverlay() {
      set({ typing: null });
      if (router.canGoBack()) router.back();
      else router.replace('/' as Href);
    },
    openStory(i: number) {
      router.push({ pathname: '/story', params: { i: String(i) } } as Href);
    },
    startCall(name: string) {
      router.push({ pathname: '/call', params: { name } } as Href);
    },
    openCompose() {
      router.push('/compose' as Href);
    },
    openNotifs() {
      set({ notifsSeen: true });
      router.push('/notifications' as Href);
    },
    openDiscover() {
      router.push('/discover' as Href);
    },
    send(id: string, text: string) {
      const t = text.trim();
      if (!t || !id) return;
      const at = nowAt();
      set(s => ({ msgs: { ...s.msgs, [id]: [...(s.msgs[id] || []), { f: 'me', t, at }] } }));
      if (GROUPS[id]) return;
      later(() => set({ typing: id }), 700);
      later(() => set(s => {
        const list = s.msgs[id] || [];
        return { typing: s.typing === id ? null : s.typing, msgs: { ...s.msgs, [id]: [...list, { f: 'them', t: REPLIES[list.length % REPLIES.length], at }] } };
      }), 2000);
    },
    publish(text: string, withImg: boolean, audience: Audience | 'Everyone' | null) {
      const s = get();
      if (!text.trim() && !withImg) return false;
      const aud = audience || (s.mode === 'work' ? 'Colleagues' : 'Friends');
      const mode: Post['mode'] = aud === 'Friends' ? 'personal' : aud === 'Colleagues' ? 'work' : 'both';
      const post: Post = {
        id: 'u' + Date.now(), mode, aud: aud === 'Everyone' ? 'Public' : aud, author: s.name || 'Alex Rivera', src: A.me,
        meta: 'Just now', time: 'now', text: text.trim(), img: withImg ? IMG(1060) : null, imgH: 260, likes: 0, comments: 0,
      };
      set(st => ({ posts: [post, ...st.posts] }));
      closeOverlays();
      router.navigate('/' as Href);
      if (mode !== 'both' && mode !== s.mode) a.setMode(mode);
      a.flash(aud === 'Everyone' ? 'Posted to both spaces' : 'Posted to ' + (aud === 'Friends' ? 'Personal' : 'Work') + ' only');
      return true;
    },
    goJobs() {
      a.goTab('jobs');
      a.setMode('work');
    },
    // Nearby
    meetList(m: Mode) {
      return [...MEETS[m], ...get().myMeets[m]];
    },
    selectNear(id: string | null) {
      set({ nearSel: id });
    },
    recenter() {
      set(s => ({ nearSel: null, recenterKey: s.recenterKey + 1 }));
    },
    ensureChat(p: NearPerson) {
      const id = p.chat || 'near-' + p.id;
      const s = get();
      if (!CHATS.find(c => c.id === id) && !s.extraChats.find(c => c.id === id)) {
        set(st => ({ extraChats: [{ id, mode: st.mode, name: p.name, last: '', time: 'now', unread: 0, sub: p.tag + ' · ' + p.dist + ' away' }, ...st.extraChats] }));
      }
      return id;
    },
    wave(p: NearPerson) {
      const s = get();
      if (s.waved[p.id]) return;
      const m = s.mode, id = a.ensureChat(p), first = firstName(p.name), at = nowAt();
      const t = m === 'work' ? 'Hi ' + first + ", I'm close by. Up for a quick coffee chat?" : 'Hi ' + first + "! I'm nearby, want to meet up?";
      set(st => ({ waved: { ...st.waved, [p.id]: true }, msgs: { ...st.msgs, [id]: [...(st.msgs[id] || []), { f: 'me', t, at }] } }));
      a.flash('You said hi to ' + first);
      later(() => {
        set(st => ({ msgs: { ...st.msgs, [id]: [...(st.msgs[id] || []), { f: 'them', t: m === 'work' ? "Sure! I'm at the window table." : 'Yes! Meet by the pergola in 10?', at }] } }));
        a.flash(first + ' replied. Tap Message to chat.');
      }, 2600);
    },
    messageNear(p: NearPerson) {
      a.openChat(a.ensureChat(p));
    },
    startMeet() {
      const s = get(), m = s.mode, first = firstName(s.name || 'Alex');
      const x: Meet = {
        id: 'my' + Date.now(), title: m === 'work' ? 'Coffee chat with ' + first : 'Hang out with ' + first, where: 'Near Lake Merritt',
        ll: [CENTER[0] + 0.0007, CENTER[1] - 0.0009], time: 'Now', when: 'Starting now · 1 hour', going: 1, cover: IMG(431), mine: true,
      };
      set(st => ({ myMeets: { ...st.myMeets, [m]: [...st.myMeets[m], x] }, nearFilter: 'meetups', nearSel: x.id }));
      a.flash(m === 'work' ? 'Shared with colleagues nearby' : 'Shared with friends nearby');
    },
    toggleVisible() {
      const s = get(), m = s.mode, vis = s.nearVis[m];
      set({ nearVis: { ...s.nearVis, [m]: !vis } });
      a.flash((vis ? 'Hidden from ' : 'Visible to ') + (m === 'work' ? 'colleagues' : 'friends') + ' nearby');
    },
    joinMeet(x: Meet) {
      if (x.mine) return;
      const s = get(), j = !s.joined[x.id];
      set({ joined: { ...s.joined, [x.id]: j } });
      if (j) a.flash("You're going to " + x.title);
    },
    jump(k: JumpKey) {
      const s = get();
      set({ onboarding: false, typing: null });
      closeOverlays();
      const go = (fn: () => void) => setTimeout(fn, 0);
      switch (k) {
        case 'onboarding': set({ onboarding: true, step: 0 }); return;
        case 'story': go(() => { router.navigate('/' as Href); a.openStory(0); }); return;
        case 'thread': go(() => { router.navigate('/chats' as Href); a.openChat(s.mode === 'work' ? 'priya' : 'maya'); }); return;
        case 'group': go(() => { router.navigate((s.mode === 'work' ? '/chats' : '/groups') as Href); a.openChat(s.mode === 'work' ? 'guild' : 'football'); }); return;
        case 'jobs': go(() => { router.navigate('/jobs' as Href); a.setMode('work'); }); return;
        case 'groups': go(() => { router.navigate('/groups' as Href); a.setMode('personal'); }); return;
        case 'home': go(() => router.navigate('/' as Href)); return;
        case 'chats': set({ chatTab: 'chats' }); go(() => router.navigate('/chats' as Href)); return;
        case 'calls': set({ chatTab: 'calls' }); go(() => router.navigate('/chats' as Href)); return;
        case 'nearby': set({ nearSel: null }); go(() => router.navigate('/nearby' as Href)); return;
        case 'profile': go(() => router.navigate('/profile' as Href)); return;
        case 'compose': go(() => a.openCompose()); return;
        case 'notifs': go(() => a.openNotifs()); return;
        case 'discover': go(() => a.openDiscover()); return;
      }
    },
  };
  return a;
}

export type DuoActions = ReturnType<typeof makeActions>;
type Ctx = { s: DuoState; a: DuoActions };
const DuoContext = createContext<Ctx | null>(null);

export function DuoProvider({ children }: { children: React.ReactNode }) {
  const [box] = useState<Box>(() => ({ s: initialState(), path: '/', timers: new Set() }));
  const [s, setS] = useState(box.s);
  const [a] = useState(() => makeActions(box, setS));
  const pathname = usePathname();
  useLayoutEffect(() => {
    // `box` is only read by event handlers, never during render.
    // eslint-disable-next-line react-hooks/immutability
    box.path = pathname;
  }, [box, pathname]);
  useEffect(() => () => box.timers.forEach(clearTimeout), [box]);

  const value = useMemo(() => ({ s, a }), [s, a]);
  return <DuoContext.Provider value={value}>{children}</DuoContext.Provider>;
}

export function useDuo() {
  const c = useContext(DuoContext);
  if (!c) throw new Error('useDuo must be used inside DuoProvider');
  return c;
}
