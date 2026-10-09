import React, { useState } from 'react';
import { Animated, Easing, ScrollView, View } from 'react-native';
import { BYNAME, JOBS, MENTORS } from '../../data';
import { useDuo } from '../../store';
import { G, INDIGO, slate } from '../../theme';
import { Avatar, Btn, DSButton, Gradient, Icon, Img, Scrim, Txt, center, fill, row } from '../../components/ui';

type Exit = 'left' | 'right' | 'up';
const FILTERS = ['All', 'Full-time', 'Contract', 'Gig'] as const;

export default function Jobs() {
  const { s, a } = useDuo();
  const [exit, setExit] = useState<Exit | null>(null);
  const [cardW, setCardW] = useState(360);
  const anim = useState(() => new Animated.Value(0))[0];

  const inFilter = JOBS.filter(j => s.jobFilter === 'All' || j.type === s.jobFilter);
  const list = inFilter.filter(j => !s.gone[j.id]);
  const job = list[0] || JOBS[0];

  const act = (kind: 'skip' | 'apply' | 'save') => {
    const j = list[0];
    if (!j || exit) return;
    if (kind === 'save') a.flash('Saved ' + j.title);
    setExit(kind === 'skip' ? 'left' : kind === 'apply' ? 'right' : 'up');
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 280, easing: Easing.ease, useNativeDriver: true }).start(() => {
      a.set(st => ({ gone: { ...st.gone, [j.id]: kind }, applied: kind === 'apply' ? { ...st.applied, [j.id]: true } : st.applied }));
      setExit(null);
      anim.setValue(0);
    });
    if (kind === 'apply') a.flash(j.type === 'Gig' ? 'Proposal sent to ' + j.co : 'Applied with your Work profile');
  };

  const dx = exit === 'left' ? -1.2 * cardW : exit === 'right' ? 1.2 * cardW : 0;
  const rot = exit === 'left' ? '-14deg' : exit === 'right' ? '14deg' : '0deg';
  const dy = exit === 'up' ? -1.1 * 418 : 0;
  const cardStyle = {
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
    transform: [
      { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [0, dx] }) },
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, dy] }) },
      { rotate: anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', rot] }) },
    ],
  };
  const savedN = Object.values(s.gone).filter(v => v === 'save').length;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingTop: 4, paddingHorizontal: 16, paddingBottom: 14 }}>
        {FILTERS.map(l => {
          const on = s.jobFilter === l;
          return (
            <Btn key={l} onPress={() => a.set({ jobFilter: l })} style={{ height: 34, paddingHorizontal: 14, borderRadius: 40, ...center, backgroundColor: on ? INDIGO : '#fff', boxShadow: `inset 0 0 0 1px ${on ? INDIGO : slate[200]}` }}>
              <Txt size={12} w={600} color={on ? '#fff' : slate[900]}>{l === 'Gig' ? 'Gigs' : l}</Txt>
            </Btn>
          );
        })}
      </ScrollView>

      {list.length > 0 ? (
        <>
          <View style={{ height: 440, marginHorizontal: 16 }} onLayout={e => setCardW(e.nativeEvent.layout.width)}>
            {list.length > 2 && <View style={{ position: 'absolute', top: 22, bottom: 0, left: 18, right: 18, borderRadius: 24, backgroundColor: '#e4e0f7' }} />}
            {list.length > 1 && <View style={{ position: 'absolute', top: 11, bottom: 0, left: 9, right: 9, borderRadius: 24, backgroundColor: '#c9c2ef' }} />}
            <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 22, borderRadius: 24, backgroundColor: '#fff', boxShadow: `0 10px 30px rgba(78,58,186,.18)` }, cardStyle]}>
              <View style={{ flex: 1, borderRadius: 24, overflow: 'hidden', boxShadow: `inset 0 0 0 1px ${slate[200]}` }}>
                <View style={{ height: 190 }}>
                  <Img src={job.cover} style={fill} />
                  <Scrim stops={[['rgba(15,23,42,0)', 0.4], ['rgba(15,23,42,.6)', 1]]} />
                  <View style={[row, { position: 'absolute', top: 12, left: 12, height: 26, paddingHorizontal: 10, borderRadius: 40, backgroundColor: '#fff' }]}>
                    <Txt size={11} w={700} color={INDIGO}>{job.type}</Txt>
                  </View>
                  <View style={[row, { position: 'absolute', top: 12, right: 12, height: 26, paddingHorizontal: 10, borderRadius: 40, backgroundColor: 'rgba(15,23,42,.6)' }]}>
                    <Txt size={11} w={600} color="#fff">{inFilter.length - list.length + 1} of {inFilter.length}</Txt>
                  </View>
                </View>
                <View style={{ paddingTop: 32, paddingHorizontal: 16, paddingBottom: 14, gap: 10, flex: 1 }}>
                  <View>
                    <Txt size={17} w={700} ls={-0.015}>{job.title}</Txt>
                    <Txt size={13} color={slate[600]}>{job.co} · {job.loc}</Txt>
                  </View>
                  <Txt size={14} w={700} color={INDIGO}>{job.pay}</Txt>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {job.tags.map(t => (
                      <View key={t} style={{ height: 26, paddingHorizontal: 10, borderRadius: 40, backgroundColor: '#f1effc', justifyContent: 'center' }}>
                        <Txt size={11} w={600} color={INDIGO}>{t}</Txt>
                      </View>
                    ))}
                  </View>
                  <View style={{ flex: 1 }} />
                  {!!job.ref && (
                    <View style={[row, { gap: 8 }]}>
                      <Avatar src={job.refSrc} size={24} />
                      <Txt size={12} w={500} color={slate[700]}>{job.ref}</Txt>
                    </View>
                  )}
                </View>
              </View>
              <Gradient g={G.work135} style={{ position: 'absolute', left: 14, top: 190 - 30, width: 52, height: 52, borderRadius: 14, ...center, boxShadow: '0 0 0 4px #fff' }}>
                <Txt size={14} w={800} color="#fff">{job.i}</Txt>
              </Gradient>
            </Animated.View>
          </View>
          <View style={[row, { justifyContent: 'center', gap: 18, paddingTop: 6, paddingBottom: 4 }]}>
            <Btn onPress={() => act('skip')} accessibilityLabel="Skip" style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff', ...center, boxShadow: '0 2px 8px rgba(15,23,42,.12)' }}>
              <Icon name="IconX" size={24} color={slate[500]} />
            </Btn>
            <Btn onPress={() => act('apply')} style={{ borderRadius: 40, boxShadow: '0 8px 20px rgba(78,58,186,.35)' }}>
              <Gradient g={G.work90} style={[row, { height: 64, paddingHorizontal: 28, borderRadius: 40, gap: 8 }]}>
                <Icon name="IconSend" size={18} color="#fff" />
                <Txt size={15} w={700} color="#fff">{job.type === 'Gig' ? 'Send proposal' : 'Easy apply'}</Txt>
              </Gradient>
            </Btn>
            <Btn onPress={() => act('save')} accessibilityLabel="Save" style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff', ...center, boxShadow: '0 2px 8px rgba(15,23,42,.12)' }}>
              <Icon name="IconBookmark" size={22} color={INDIGO} />
            </Btn>
          </View>
        </>
      ) : (
        <View style={{ marginHorizontal: 16, paddingVertical: 40, paddingHorizontal: 24, borderRadius: 24, backgroundColor: '#f1effc', alignItems: 'center', gap: 10 }}>
          <Txt size={16} w={700}>{"You're all caught up"}</Txt>
          <Txt size={13} color={slate[600]} center>
            You applied to {Object.keys(s.applied).length} and saved {savedN}. New roles show up as your network shares them.
          </Txt>
          <DSButton variant="outline" label="Start over" onPress={() => a.set({ gone: {} })} />
        </View>
      )}

      <View style={[row, { paddingTop: 22, paddingHorizontal: 16, paddingBottom: 8, justifyContent: 'space-between', alignItems: 'baseline' }]}>
        <Txt size={15} w={700}>Mentors open to requests</Txt>
        <Txt size={11} color={slate[500]}>Free · 30 min</Txt>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 16, paddingBottom: 8 }}>
        {MENTORS.map(x => {
          const d = !!s.mentorReq[x.id];
          return (
            <View key={x.id} style={{ width: 150, height: 200, borderRadius: 18, overflow: 'hidden', backgroundColor: slate[900] }}>
              <Img src={BYNAME[x.name]} style={fill} />
              <Scrim stops={[['rgba(78,58,186,0)', 0.3], ['rgba(78,58,186,.9)', 1]]} />
              <View style={{ position: 'absolute', left: 10, right: 10, bottom: 10, gap: 8 }}>
                <View>
                  <Txt size={13} w={700} color="#fff">{x.name}</Txt>
                  <Txt size={11} color="rgba(255,255,255,.85)">{x.topic}</Txt>
                </View>
                <Btn
                  onPress={() => { if (d) return; a.set(st => ({ mentorReq: { ...st.mentorReq, [x.id]: true } })); a.flash('Request sent to ' + x.name); }}
                  style={{ height: 32, borderRadius: 40, backgroundColor: d ? 'rgba(255,255,255,.25)' : '#fff', ...center }}
                >
                  <Txt size={11} w={700} color={d ? '#fff' : INDIGO}>{d ? 'Requested' : 'Request session'}</Txt>
                </Btn>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </ScrollView>
  );
}
