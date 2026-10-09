import React from 'react';
import { ScrollView, View } from 'react-native';
import { BYNAME, MEET_FACES, NEAR } from '../../data';
import { useDuo } from '../../store';
import { slate, TH } from '../../theme';
import { useDesignInsets } from '../../components/insets';
import NearbyMap from '../../components/map/NearbyMap';
import { Avatar, Btn, Gradient, Icon, Img, Scrim, Txt, center, fill, row } from '../../components/ui';

const floatShadow = '0 2px 10px rgba(15,23,42,.14)';
const cardShadow = '0 6px 18px rgba(15,23,42,.14)';
const sheetShadow = '0 10px 28px rgba(15,23,42,.2)';

export default function Nearby() {
  const { s, a } = useDuo();
  const ins = useDesignInsets();
  const m = s.mode, T = TH[m], isW = m === 'work';
  const isP = s.nearFilter === 'people', vis = s.nearVis[m];

  const people = NEAR[m].map(p => ({ ...p, src: BYNAME[p.name], waved: !!s.waved[p.id] }));
  const meets = a.meetList(m).map(x => ({ ...x, isGoing: !!s.joined[x.id] || !!x.mine, goingN: x.going + (s.joined[x.id] ? 1 : 0) }));
  const selP = people.find(p => p.id === s.nearSel);
  const selM = meets.find(x => x.id === s.nearSel);
  const noSel = !selP && !selM;

  const seg = (on: boolean) => ({ bg: on ? T.accent : 'transparent', fg: on ? '#fff' : slate[700] });
  const sp = seg(isP), sm = seg(!isP);

  return (
    <View style={{ flex: 1, backgroundColor: slate[200], overflow: 'hidden' }}>
      <NearbyMap theme={T} visible={vis} filter={s.nearFilter} people={people} meets={meets} selected={s.nearSel} recenterKey={s.recenterKey} onSelect={id => a.selectNear(id)} />

      <View style={[row, { position: 'absolute', top: 10, left: 12, right: 12, gap: 8 }]}>
        <View style={{ flexDirection: 'row', padding: 3, backgroundColor: '#fff', borderRadius: 40, boxShadow: floatShadow }}>
          <Btn onPress={() => a.set({ nearFilter: 'people', nearSel: null })} style={{ height: 32, paddingHorizontal: 12, borderRadius: 40, backgroundColor: sp.bg, ...center }}>
            <Txt size={12} w={700} color={sp.fg}>People · {people.length}</Txt>
          </Btn>
          <Btn onPress={() => a.set({ nearFilter: 'meetups', nearSel: null })} style={{ height: 32, paddingHorizontal: 12, borderRadius: 40, backgroundColor: sm.bg, ...center }}>
            <Txt size={12} w={700} color={sm.fg}>Meetups · {meets.length}</Txt>
          </Btn>
        </View>
        <View style={{ flex: 1 }} />
        <Btn onPress={a.toggleVisible} style={[row, { height: 38, paddingHorizontal: 12, borderRadius: 40, gap: 5, backgroundColor: vis ? '#fff' : slate[900], boxShadow: floatShadow }]}>
          <Icon name={vis ? 'IconEye' : 'IconEyeOff'} size={14} color={vis ? T.accent : '#fff'} />
          <Txt size={12} w={700} color={vis ? T.accent : '#fff'}>{vis ? 'Visible' : 'Hidden'}</Txt>
        </Btn>
      </View>
      <View style={[row, { position: 'absolute', top: 52, left: 12, height: 26, paddingHorizontal: 10, borderRadius: 40, backgroundColor: 'rgba(255,255,255,.92)', gap: 5, pointerEvents: 'none' }]}>
        <Icon name="IconLocateFixed" size={12} color={slate[700]} />
        <Txt size={11} w={600} color={slate[700]}>{isW ? 'Professionals open to meeting' : 'Friends and people open to meet'}</Txt>
      </View>
      <Btn onPress={a.recenter} accessibilityLabel="Recenter" style={{ position: 'absolute', right: 12, top: 58, width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', ...center, boxShadow: floatShadow }}>
        <Icon name="IconNavigation" size={18} color={T.accent} />
      </Btn>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: ins.tabBarBottom + 68 + 12, gap: 10 }}>
        {noSel && (
          <View style={{ alignItems: 'center' }}>
            <Btn onPress={a.startMeet} style={{ borderRadius: 40, boxShadow: `0 6px 16px ${T.shadow}` }}>
              <Gradient g={T.grad} style={[row, { height: 42, paddingHorizontal: 18, borderRadius: 40, gap: 6 }]}>
                <Icon name="IconPlus" size={16} color="#fff" />
                <Txt size={13} w={700} color="#fff">{isW ? 'Start a coffee chat here' : 'Start a meetup here'}</Txt>
              </Gradient>
            </Btn>
          </View>
        )}

        {noSel && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 12, paddingBottom: 4 }} style={{ overflow: 'visible' }}>
            {isP
              ? people.map(np => (
                  <Btn key={np.id} onPress={() => a.selectNear(np.id)} style={[row, { width: 236, backgroundColor: '#fff', borderRadius: 20, padding: 10, gap: 10, boxShadow: cardShadow }]}>
                    <Avatar src={np.src} size={48} />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Txt size={13} w={700}>{np.name}</Txt>
                      <Txt size={11} color={slate[600]} numberOfLines={1}>{np.status}</Txt>
                      <Txt size={11} w={700} color={T.accent} style={{ marginTop: 2 }}>{np.dist} away</Txt>
                    </View>
                  </Btn>
                ))
              : meets.map(nm => (
                  <Btn key={nm.id} onPress={() => a.selectNear(nm.id)} style={[row, { width: 236, backgroundColor: '#fff', borderRadius: 20, padding: 10, gap: 10, boxShadow: cardShadow }]}>
                    <Img src={nm.cover} style={{ width: 48, height: 48, borderRadius: 14 }} />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Txt size={13} w={700} numberOfLines={1}>{nm.title}</Txt>
                      <Txt size={11} color={slate[600]} numberOfLines={1}>{nm.where}</Txt>
                      <Txt size={11} w={700} color={T.accent} style={{ marginTop: 2 }}>{nm.when} · {nm.goingN} going</Txt>
                    </View>
                  </Btn>
                ))}
          </ScrollView>
        )}

        {selP && (
          <View style={{ marginHorizontal: 12, backgroundColor: '#fff', borderRadius: 24, padding: 14, gap: 12, boxShadow: sheetShadow }}>
            <View style={[row, { gap: 12 }]}>
              <Avatar src={selP.src} size={56} style={{ boxShadow: `0 0 0 3px ${T.soft}` }} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Txt size={15} w={800} ls={-0.01}>{selP.name}</Txt>
                <Txt size={11} color={slate[500]}>{selP.tag}</Txt>
                <View style={[row, { gap: 4, marginTop: 2 }]}>
                  <Icon name="IconMapPin" size={12} color={T.accent} />
                  <Txt size={11} w={700} color={T.accent}>{selP.dist} away</Txt>
                </View>
              </View>
              <Btn onPress={() => a.selectNear(null)} accessibilityLabel="Close" style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: slate[100], ...center, alignSelf: 'flex-start' }}>
                <Icon name="IconX" size={16} color={slate[600]} />
              </Btn>
            </View>
            <View style={{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, backgroundColor: T.tint }}>
              <Txt size={12} lh={1.4} color={slate[700]}>{selP.status}</Txt>
            </View>
            <View style={[row, { gap: 8 }]}>
              <Btn onPress={() => a.wave(selP)} style={{ flex: 1, height: 44, borderRadius: 40, overflow: 'hidden' }}>
                {selP.waved ? <View style={[fill, { backgroundColor: slate[100] }]} /> : <Gradient g={T.grad} style={fill} />}
                <View style={[row, { flex: 1, justifyContent: 'center', gap: 6 }]}>
                  <Icon name="IconHand" size={17} color={selP.waved ? slate[500] : '#fff'} />
                  <Txt size={13} w={700} color={selP.waved ? slate[500] : '#fff'}>{selP.waved ? 'Said hi' : 'Say hi'}</Txt>
                </View>
              </Btn>
              <Btn onPress={() => a.messageNear(selP)} style={[row, { flex: 1, height: 44, borderRadius: 40, backgroundColor: T.soft, justifyContent: 'center', gap: 6 }]}>
                <Icon name="IconMessageCircle" size={17} color={T.accent} />
                <Txt size={13} w={700} color={T.accent}>Message</Txt>
              </Btn>
            </View>
          </View>
        )}

        {selM && (
          <View style={{ marginHorizontal: 12, backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: sheetShadow }}>
            <View style={{ height: 110 }}>
              <Img src={selM.cover} style={fill} />
              <Scrim stops={[['rgba(15,23,42,0)', 0], ['rgba(15,23,42,.55)', 1]]} />
              <Btn onPress={() => a.selectNear(null)} accessibilityLabel="Close" style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,.92)', ...center }}>
                <Icon name="IconX" size={16} />
              </Btn>
              <View style={[row, { position: 'absolute', left: 14, bottom: 10, gap: 5 }]}>
                <Icon name="IconCalendar" size={13} color="#fff" />
                <Txt size={11} w={700} color="#fff">{selM.when}</Txt>
              </View>
            </View>
            <View style={{ paddingTop: 12, paddingHorizontal: 14, paddingBottom: 14, gap: 10 }}>
              <View>
                <Txt size={15} w={800} ls={-0.01}>{selM.title}</Txt>
                <Txt size={11} color={slate[500]}>{selM.where}</Txt>
              </View>
              <View style={[row, { gap: 10 }]}>
                <View style={[row, { paddingLeft: 8 }]}>
                  {MEET_FACES[m].map(f => <Avatar key={f} src={f} size={26} style={{ marginLeft: -8, boxShadow: '0 0 0 2px #fff' }} />)}
                </View>
                <Txt size={12} w={600} color={slate[700]} style={{ flex: 1 }}>{selM.goingN} going</Txt>
                <Btn onPress={() => a.joinMeet(selM)} style={{ height: 40, borderRadius: 40, overflow: 'hidden' }}>
                  {selM.isGoing ? <View style={[fill, { backgroundColor: T.soft }]} /> : <Gradient g={T.grad} style={fill} />}
                  <View style={{ flex: 1, paddingHorizontal: 20, ...center }}>
                    <Txt size={13} w={700} color={selM.isGoing ? T.accent : '#fff'}>
                      {selM.isGoing ? (selM.mine ? 'Hosting' : "You're going") : 'Join'}
                    </Txt>
                  </View>
                </Btn>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

