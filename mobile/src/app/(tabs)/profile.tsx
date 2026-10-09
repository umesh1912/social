import React, { useEffect, useState } from 'react';
import { Animated, Easing, ScrollView, View } from 'react-native';
import { A, IMG, SKILLS } from '../../data';
import { useDuo } from '../../store';
import { G, INDIGO, PINK, slate } from '../../theme';
import { Avatar, Btn, DSSwitch, Gradient, Icon, Img, Scrim, Txt, center, fill, row } from '../../components/ui';

const PHOTOS = [1018, 1011, 1080, 1025, 1039, 1012].map(IMG);
const PORTFOLIO = [{ t: 'Lumen onboarding', img: IMG(180) }, { t: 'Payments dashboard', img: IMG(8) }, { t: 'Design system v2', img: IMG(60) }];

export default function Profile() {
  const { s, a } = useDuo();
  const isW = s.mode === 'work';
  const viewAs = s.viewAs || (isW ? 'colleagues' : 'friends');
  const vF = viewAs === 'friends';
  const meName = s.name || 'Alex Rivera', meCompany = s.company || 'Northwind', meRole = s.role || 'Product Designer';

  // 3D flip (CSS: rotateY over .7s cubic-bezier(.3,.7,.2,1)).
  const flip = useState(() => new Animated.Value(vF ? 0 : 1))[0];
  useEffect(() => {
    Animated.timing(flip, { toValue: vF ? 0 : 1, duration: 700, easing: Easing.bezier(0.3, 0.7, 0.2, 1), useNativeDriver: true }).start();
  }, [vF, flip]);
  const front = {
    opacity: flip.interpolate({ inputRange: [0, 0.5, 0.501, 1], outputRange: [1, 1, 0, 0] }),
    transform: [{ perspective: 1400 }, { rotateY: flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }],
  };
  const back = {
    opacity: flip.interpolate({ inputRange: [0, 0.5, 0.501, 1], outputRange: [0, 0, 1, 1] }),
    transform: [{ perspective: 1400 }, { rotateY: flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] }) }],
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: 6, paddingHorizontal: 16 }}>
        <View style={{ height: 330 }}>
          {/* Front: what friends see */}
          <Animated.View style={[fill, { borderRadius: 24, backgroundColor: '#fff', boxShadow: '0 10px 30px rgba(219,78,102,.18)', backfaceVisibility: 'hidden' }, front, { pointerEvents: vF ? 'auto' : 'none' }]}>
            <View style={[fill, { borderRadius: 24, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px #fce7eb' }]}>
              <View style={{ height: 130 }}>
                <Img src={IMG(1015)} style={fill} />
                <Scrim stops={[['rgba(219,78,102,0)', 0], ['rgba(219,78,102,.45)', 1]]} />
              </View>
              <View style={{ paddingHorizontal: 18, marginTop: -42, gap: 10 }}>
                <Avatar src={A.me} size={84} style={{ boxShadow: '0 0 0 4px #fff' }} />
                <View>
                  <Txt size={19} w={800} ls={-0.02}>{meName}</Txt>
                  <Txt size={13} color={slate[600]}>Oakland · climbing, coffee, houseplants</Txt>
                </View>
                <View style={[row, { gap: 18 }]}>
                  <Stat n="342" l="friends" /><Stat n="4" l="groups" /><Stat n="86" l="photos" />
                </View>
              </View>
              <View style={[row, { position: 'absolute', top: 12, right: 12, height: 26, paddingHorizontal: 10, borderRadius: 40, backgroundColor: '#fff', gap: 5 }]}>
                <Icon name="IconHeart" size={12} color={PINK} />
                <Txt size={11} w={700} color={PINK}>Friends see</Txt>
              </View>
            </View>
          </Animated.View>

          {/* Back: what colleagues see */}
          <Animated.View style={[fill, { borderRadius: 24, boxShadow: '0 10px 30px rgba(78,58,186,.3)', backfaceVisibility: 'hidden' }, back, { pointerEvents: vF ? 'none' : 'auto' }]}>
            <Gradient g={G.workCard} style={[fill, { borderRadius: 24, overflow: 'hidden', paddingVertical: 22, paddingHorizontal: 18, gap: 12 }]}>
              <View style={[row, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
                <Img src={A.me} style={{ width: 76, height: 76, borderRadius: 20, boxShadow: '0 0 0 3px rgba(255,255,255,.5)' }} />
                <View style={[row, { height: 26, paddingHorizontal: 10, borderRadius: 40, backgroundColor: '#fff', gap: 5 }]}>
                  <Icon name="IconBriefcase" size={12} color={INDIGO} />
                  <Txt size={11} w={700} color={INDIGO}>Colleagues see</Txt>
                </View>
              </View>
              <View>
                <View style={[row, { gap: 6 }]}>
                  <Txt size={19} w={800} ls={-0.02} color="#fff">{meName}</Txt>
                  <Icon name="IconShieldCheck" size={18} color="#fff" />
                </View>
                <Txt size={13} color="rgba(255,255,255,.9)">{meRole} at {meCompany}</Txt>
              </View>
              <View style={[row, { alignSelf: 'flex-start', gap: 6, backgroundColor: 'rgba(255,255,255,.16)', borderRadius: 40, height: 28, paddingHorizontal: 10 }]}>
                <Icon name="IconShieldCheck" size={13} color="#fff" />
                <Txt size={11} w={600} color="#fff">Verified at {meCompany}</Txt>
              </View>
              <View style={{ flex: 1 }} />
              <View style={[row, { gap: 8 }]}>
                {[['518', 'connections'], ['112', 'endorsements'], ['3', 'mentees']].map(([n, l]) => (
                  <View key={l} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,.14)', borderRadius: 14, padding: 10 }}>
                    <Txt size={17} w={800} color="#fff">{n}</Txt>
                    <Txt size={11} color="rgba(255,255,255,.85)" numberOfLines={1}>{l}</Txt>
                  </View>
                ))}
              </View>
            </Gradient>
          </Animated.View>
        </View>

        <View style={{ flexDirection: 'row', padding: 4, backgroundColor: slate[100], borderRadius: 40, marginTop: 14 }}>
          <Btn onPress={() => a.set({ viewAs: 'friends' })} style={{ flex: 1, height: 36, borderRadius: 40, ...center, backgroundColor: vF ? PINK : 'transparent' }}>
            <Txt size={13} w={600} color={vF ? '#fff' : slate[500]}>As friends see it</Txt>
          </Btn>
          <Btn onPress={() => a.set({ viewAs: 'colleagues' })} style={{ flex: 1, height: 36, borderRadius: 40, ...center, backgroundColor: !vF ? INDIGO : 'transparent' }}>
            <Txt size={13} w={600} color={!vF ? '#fff' : slate[500]}>As colleagues see it</Txt>
          </Btn>
        </View>
      </View>

      {vF ? (
        <View style={{ paddingTop: 18, paddingHorizontal: 16, gap: 10 }}>
          <Txt size={15} w={700}>Photos</Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, borderRadius: 16, overflow: 'hidden' }}>
            {PHOTOS.map((ph, i) => <Img key={i} src={ph} style={{ width: '32.4%', flexGrow: 1, aspectRatio: 1 }} />)}
          </View>
        </View>
      ) : (
        <View style={{ paddingTop: 18, paddingHorizontal: 16, gap: 20 }}>
          <View style={[row, { gap: 10, padding: 14, borderRadius: 18, backgroundColor: '#f1effc' }]}>
            <View style={{ flex: 1 }}>
              <Txt size={13} w={600}>Open to mentoring</Txt>
              <Txt size={11} color={slate[600]}>People can request a 30 min session</Txt>
            </View>
            <DSSwitch checked={s.mentorOpen} onChange={v => a.set({ mentorOpen: v })} />
          </View>
          <View style={{ gap: 12 }}>
            <Txt size={15} w={700}>Skills</Txt>
            {SKILLS.map(([name, n, by]) => (
              <View key={name} style={{ gap: 6 }}>
                <View style={[row, { gap: 8, alignItems: 'baseline' }]}>
                  <Txt size={13} w={600} style={{ flex: 1 }}>{name}</Txt>
                  <Txt size={12} w={700} color={INDIGO}>{n}</Txt>
                </View>
                <View style={{ height: 6, borderRadius: 40, backgroundColor: '#f1effc', overflow: 'hidden' }}>
                  <Gradient g={G.work90} style={{ height: '100%', width: `${Math.round((n / 42) * 100)}%`, borderRadius: 40 }} />
                </View>
                <Txt size={11} color={slate[500]}>{by}</Txt>
              </View>
            ))}
          </View>
          <View style={{ gap: 10 }}>
            <Txt size={15} w={700}>Portfolio</Txt>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16 }} contentContainerStyle={{ gap: 10, paddingHorizontal: 16 }}>
              {PORTFOLIO.map(pf => (
                <View key={pf.t} style={{ width: 200, gap: 6 }}>
                  <Img src={pf.img} style={{ width: 200, height: 140, borderRadius: 16 }} />
                  <Txt size={12} w={600}>{pf.t}</Txt>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={{ gap: 12 }}>
            <Txt size={15} w={700}>Experience</Txt>
            {[{ r: meRole, c: meCompany, d: '2023 – now', i: meCompany.slice(0, 2).toUpperCase() }, { r: 'Designer', c: 'Lumen', d: '2020 – 2023', i: 'LU' }].map(ex => (
              <View key={ex.c + ex.d} style={[row, { gap: 12 }]}>
                <Gradient g={G.work135} style={{ width: 42, height: 42, borderRadius: 12, ...center }}>
                  <Txt size={11} w={800} color="#fff">{ex.i}</Txt>
                </Gradient>
                <View>
                  <Txt size={13} w={600}>{ex.r}</Txt>
                  <Txt size={12} color={slate[500]}>{ex.c} · {ex.d}</Txt>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={{ marginTop: 20, marginHorizontal: 16, padding: 14, borderRadius: 18, backgroundColor: vF ? '#fdf2f4' : '#f3f1fc', flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
        <Icon name="IconEyeOff" size={16} color={vF ? PINK : INDIGO} />
        <Txt size={12} lh={1.45} color={slate[700]} style={{ flex: 1 }}>
          {vF
            ? 'Hidden from friends: work history, skills, portfolio, work chats and job activity.'
            : 'Hidden from colleagues: photos, friends list, personal posts, stories and last seen.'}
        </Txt>
      </View>
    </ScrollView>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <Txt size={12} color={slate[500]}>
      <Txt size={12} w={700}>{n}</Txt> {l}
    </Txt>
  );
}
