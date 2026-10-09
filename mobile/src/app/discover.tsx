import React, { useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { BYNAME, GROUPS, JOBS, PEOPLE } from '../data';
import { useDuo } from '../store';
import { INDIGO, PINK, slate, TH } from '../theme';
import { useDesignInsets } from '../components/insets';
import { Btn, DSButton, Icon, Img, Txt, center, row } from '../components/ui';

const CATS = ['People', 'Groups', 'Jobs'] as const;
type Cat = (typeof CATS)[number];

export default function Discover() {
  const { s, a } = useDuo();
  const ins = useDesignInsets();
  const T = TH[s.mode];
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<Cat>('People');

  const q = query.trim().toLowerCase();
  const has = (x: string) => !q || x.toLowerCase().includes(q);
  const people = PEOPLE.filter(p => has(p.name + ' ' + p.meta));
  const groups = Object.entries(GROUPS).filter(([, g]) => has(g.name + ' ' + g.desc));
  const jobs = JOBS.filter(j => has(j.title + ' ' + j.co));
  const counts: Record<Cat, number> = { People: people.length, Groups: groups.length, Jobs: jobs.length };
  const label = q ? counts[cat] + ' results' : cat === 'People' ? 'People you may know' : cat === 'Groups' ? 'Groups across both spaces' : 'Shared by your network';

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={[row, { paddingTop: ins.top(56), paddingHorizontal: 16, paddingBottom: 10, gap: 10 }]}>
        <View style={[row, { flex: 1, gap: 8, height: 44, paddingHorizontal: 14, borderRadius: 40, backgroundColor: slate[100] }]}>
          <Icon name="IconSearch" size={17} color={slate[500]} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="People, groups, jobs"
            placeholderTextColor={slate[400]}
            autoFocus
            style={{ flex: 1, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: slate[900], outlineStyle: 'none' } as object}
          />
        </View>
        <DSButton variant="ghost" label="Cancel" onPress={a.closeOverlay} />
      </View>
      <View style={[row, { gap: 6, paddingHorizontal: 16, paddingBottom: 10 }]}>
        {CATS.map(l => {
          const on = cat === l;
          return (
            <Btn key={l} onPress={() => setCat(l)} style={{ height: 34, paddingHorizontal: 14, borderRadius: 40, ...center, backgroundColor: on ? T.accent : '#fff', boxShadow: `inset 0 0 0 1px ${on ? T.accent : slate[200]}` }}>
              <Txt size={12} w={600} color={on ? '#fff' : slate[900]}>{l}</Txt>
            </Btn>
          );
        })}
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30 }} keyboardShouldPersistTaps="handled">
        <Txt size={11} w={600} color={slate[500]} style={{ paddingVertical: 8, paddingHorizontal: 16 }}>{label}</Txt>

        {cat === 'People' && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 16 }}>
            {people.map(pp => {
              const c = s.connected[pp.id];
              return (
                <View key={pp.id} style={{ width: '48%', flexGrow: 1, borderRadius: 20, overflow: 'hidden', boxShadow: `inset 0 0 0 1px ${slate[200]}` }}>
                  <Img src={BYNAME[pp.name]} style={{ width: '100%', height: 130 }} />
                  <View style={{ padding: 10, gap: 8, flex: 1 }}>
                    <View style={{ flex: 1 }}>
                      <Txt size={13} w={700}>{pp.name}</Txt>
                      <Txt size={11} lh={1.35} color={slate[500]}>{pp.meta}</Txt>
                    </View>
                    {!c ? (
                      <View style={[row, { gap: 6 }]}>
                        <Btn onPress={() => a.set(st => ({ connected: { ...st.connected, [pp.id]: 'f' } }))} style={{ flex: 1, height: 32, borderRadius: 40, backgroundColor: '#fce7eb', ...center }}>
                          <Txt size={11} w={700} color={PINK}>Friend</Txt>
                        </Btn>
                        <Btn onPress={() => a.set(st => ({ connected: { ...st.connected, [pp.id]: 'c' } }))} style={{ flex: 1, height: 32, borderRadius: 40, backgroundColor: '#e4e0f7', ...center }}>
                          <Txt size={11} w={700} color={INDIGO}>Connect</Txt>
                        </Btn>
                      </View>
                    ) : (
                      <View style={[row, { height: 32, gap: 4 }]}>
                        <Icon name="IconCheck" size={14} color={c === 'f' ? PINK : INDIGO} />
                        <Txt size={11} w={600} color={c === 'f' ? PINK : INDIGO}>{c === 'f' ? 'Friend request sent' : 'Connection sent'}</Txt>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {cat === 'Groups' &&
          groups.map(([id, g]) => {
            const w = g.mode === 'work';
            return (
              <Btn
                key={id}
                hoverBg={slate[50]}
                onPress={() => { a.setMode(g.mode); setTimeout(() => a.openChat(id), 0); }}
                style={[row, { backgroundColor: '#fff', gap: 12, paddingVertical: 9, paddingHorizontal: 16 }]}
              >
                <Img src={g.cover} style={{ width: 56, height: 56, borderRadius: 16 }} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Txt size={14} w={600}>{g.name}</Txt>
                  <Txt size={12} color={slate[500]}>{g.members}</Txt>
                </View>
                <View style={[row, { height: 24, paddingHorizontal: 9, borderRadius: 40, backgroundColor: w ? '#e4e0f7' : '#fce7eb' }]}>
                  <Txt size={11} w={700} color={w ? INDIGO : PINK}>{w ? 'Work' : 'Personal'}</Txt>
                </View>
              </Btn>
            );
          })}

        {cat === 'Jobs' &&
          jobs.map(j => (
            <Btn key={j.id} hoverBg={slate[50]} onPress={a.goJobs} style={[row, { backgroundColor: '#fff', gap: 12, paddingVertical: 9, paddingHorizontal: 16 }]}>
              <Img src={j.cover} style={{ width: 56, height: 56, borderRadius: 16 }} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Txt size={14} w={600}>{j.title}</Txt>
                <Txt size={12} color={slate[500]}>{j.co} · {j.pay}</Txt>
              </View>
            </Btn>
          ))}

        {!!q && counts[cat] === 0 && (
          <Txt size={13} color={slate[500]} center style={{ paddingVertical: 40, paddingHorizontal: 16 }}>{`Nothing matches "${query}"`}</Txt>
        )}
      </ScrollView>
    </View>
  );
}
