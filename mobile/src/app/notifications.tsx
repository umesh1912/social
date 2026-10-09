import React from 'react';
import { ScrollView, View } from 'react-native';
import { BYNAME, NOTIFS, type NotifKind } from '../data';
import { useDuo } from '../store';
import { G, INDIGO, PINK, slate } from '../theme';
import { useDesignInsets } from '../components/insets';
import { Avatar, Btn, DSButton, Gradient, Icon, Txt, center, row, type IconName } from '../components/ui';

const KIND_ICON: Record<NotifKind, IconName> = { mentor: 'IconGraduationCap', action: 'IconAward', plain: 'IconHeart', job: 'IconBriefcase' };

export default function Notifications() {
  const { s, a } = useDuo();
  const ins = useDesignInsets();
  const setStatus = (id: string, v: string) => a.set(st => ({ nStatus: { ...st.nStatus, [id]: v } }));

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={[row, { paddingTop: ins.top(54), paddingHorizontal: 10, paddingBottom: 8, gap: 8 }]}>
        <DSButton variant="ghost" onPress={a.closeOverlay} accessibilityLabel="Back" style={{ width: 40, height: 40, paddingHorizontal: 0 }}>
          <Icon name="IconChevronLeft" size={22} />
        </DSButton>
        <Txt size={17} w={800} ls={-0.02} style={{ flex: 1 }}>Activity</Txt>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 4, paddingBottom: 30 }}>
        {NOTIFS.map(n => {
          const st = s.nStatus[n.id], w = n.mode === 'work';
          const dot = w ? INDIGO : PINK;
          return (
            <View key={n.id} style={{ flexDirection: 'row', gap: 12, paddingVertical: 12, paddingHorizontal: 16, marginHorizontal: 8, marginBottom: 4, borderRadius: 18, backgroundColor: n.mode === s.mode ? (w ? '#f3f1fc' : '#fdf2f4') : '#fff' }}>
              <View>
                <Avatar src={BYNAME[n.who]} initials={n.who.slice(0, 2)} size={44} />
                <View style={{ position: 'absolute', right: -3, bottom: -3, width: 20, height: 20, borderRadius: 10, backgroundColor: dot, ...center, boxShadow: '0 0 0 2px #fff' }}>
                  <Icon name={KIND_ICON[n.kind]} size={11} color="#fff" />
                </View>
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 8 }}>
                <Txt size={13} lh={1.45}>{n.text}</Txt>
                <Txt size={11} color={slate[500]}>{w ? 'Work' : 'Personal'} · {n.time}</Txt>
                {n.kind === 'mentor' && !st && (
                  <View style={[row, { gap: 8 }]}>
                    <Btn onPress={() => setStatus(n.id, 'Accepted. A Work chat was created.')} style={{ borderRadius: 40, overflow: 'hidden' }}>
                      <Gradient g={G.work90} style={{ height: 34, paddingHorizontal: 16, ...center }}>
                        <Txt size={12} w={600} color="#fff">Accept</Txt>
                      </Gradient>
                    </Btn>
                    <DSButton variant="outline" label="Decline" onPress={() => setStatus(n.id, 'Declined')} style={{ height: 34, minHeight: 34, borderRadius: 40, paddingVertical: 0 }} textStyle={{ fontSize: 14 }} />
                  </View>
                )}
                {(n.kind === 'action' || n.kind === 'job') && !st && (
                  <View style={{ flexDirection: 'row' }}>
                    <Btn
                      onPress={() => {
                        if (n.kind === 'job') { a.goJobs(); return; }
                        setStatus(n.id, n.done || '');
                      }}
                      style={{ height: 34, paddingHorizontal: 16, borderRadius: 40, backgroundColor: w ? '#e4e0f7' : '#fce7eb', ...center }}
                    >
                      <Txt size={12} w={600} color={dot}>{n.action}</Txt>
                    </Btn>
                  </View>
                )}
                {!!st && (
                  <View style={[row, { gap: 4 }]}>
                    <Icon name="IconCheck" size={14} color={dot} />
                    <Txt size={12} w={600} color={dot}>{st}</Txt>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
