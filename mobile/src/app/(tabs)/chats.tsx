import React from 'react';
import { ScrollView, View } from 'react-native';
import { BYNAME, CALLS, CHATS, GROUPS, MSGS, firstName, initials } from '../../data';
import { useDuo } from '../../store';
import { INDIGO, RED, slate, TH } from '../../theme';
import { Avatar, Btn, Gradient, Icon, Img, Txt, center, row } from '../../components/ui';

export default function Chats() {
  const { s, a } = useDuo();
  const m = s.mode, T = TH[m], isW = m === 'work';
  const chatsM = [...CHATS, ...s.extraChats].filter(c => c.mode === m);
  const seg = (on: boolean) => ({ bg: on ? '#fff' : 'transparent', fg: on ? T.accent : slate[500] });
  const cs = seg(s.chatTab === 'chats'), cl = seg(s.chatTab === 'calls');

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: T.tint, paddingTop: 4, paddingHorizontal: 16, paddingBottom: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, gap: 14 }}>
        <View style={{ flexDirection: 'row', padding: 4, backgroundColor: 'rgba(255,255,255,.7)', borderRadius: 40 }}>
          <Btn onPress={() => a.set({ chatTab: 'chats' })} style={{ flex: 1, height: 34, borderRadius: 40, backgroundColor: cs.bg, ...center }}>
            <Txt size={13} w={600} color={cs.fg}>Chats</Txt>
          </Btn>
          <Btn onPress={() => a.set({ chatTab: 'calls' })} style={{ flex: 1, height: 34, borderRadius: 40, backgroundColor: cl.bg, ...center }}>
            <Txt size={13} w={600} color={cl.fg}>Calls</Txt>
          </Btn>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
          {chatsM.filter(c => !c.group).map(c => (
            <Btn key={c.id} onPress={() => a.openChat(c.id)} style={{ width: 58, alignItems: 'center', gap: 6 }}>
              <View style={{ width: 56, height: 56 }}>
                <Avatar src={BYNAME[c.name]} size={56} />
                <View style={{ position: 'absolute', right: 1, bottom: 1, width: 14, height: 14, borderRadius: 9, backgroundColor: T.accent, boxShadow: `0 0 0 3px ${T.tint}` }} />
              </View>
              <Txt size={11} w={600}>{firstName(c.name)}</Txt>
            </Btn>
          ))}
        </ScrollView>
      </View>

      {s.chatTab === 'chats' ? (
        <>
          <View style={[row, { paddingTop: 14, paddingHorizontal: 16, paddingBottom: 6, gap: 6 }]}>
            <Icon name="IconLock" size={12} color={slate[500]} />
            <Txt size={11} color={slate[500]}>{isW ? 'Work chats. Friends never see these.' : 'Personal chats. Colleagues never see these.'}</Txt>
          </View>
          {chatsM.map(c => {
            const ms = s.msgs[c.id];
            const lm = ms && ms[ms.length - 1];
            let last = c.last;
            if (lm && ms !== MSGS[c.id]) last = (lm.f === 'me' ? 'You: ' : GROUPS[c.id] ? lm.f + ': ' : '') + lm.t;
            const un = s.read[c.id] ? 0 : c.unread;
            return (
              <Btn key={c.id} hoverBg={slate[50]} onPress={() => a.openChat(c.id)} style={[row, { backgroundColor: '#fff', gap: 12, paddingVertical: 9, paddingHorizontal: 16 }]}>
                {c.group ? (
                  <View style={{ width: 52, height: 52, borderRadius: 16, overflow: 'hidden' }}>
                    <Img src={GROUPS[c.id].cover} style={{ width: '100%', height: '100%' }} />
                  </View>
                ) : (
                  <Avatar src={BYNAME[c.name]} size={52} />
                )}
                <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                  <View style={[row, { gap: 6 }]}>
                    <View style={[row, { flex: 1, gap: 4, minWidth: 0 }]}>
                      <Txt size={14} w={600} numberOfLines={1}>{c.name}</Txt>
                      {c.verified && <Icon name="IconShieldCheck" size={14} color={INDIGO} />}
                    </View>
                    <Txt size={11} w={500} color={un ? T.accent : slate[500]}>{c.time}</Txt>
                  </View>
                  <View style={[row, { gap: 8 }]}>
                    <Txt size={13} color={slate[500]} numberOfLines={1} style={{ flex: 1 }}>{last}</Txt>
                    {un > 0 && (
                      <Gradient g={T.grad} style={{ minWidth: 22, height: 22, paddingHorizontal: 7, borderRadius: 40, ...center }}>
                        <Txt size={11} w={700} color="#fff">{un}</Txt>
                      </Gradient>
                    )}
                  </View>
                </View>
              </Btn>
            );
          })}
        </>
      ) : (
        <>
          <View style={{ height: 10 }} />
          {CALLS.filter(c => c.mode === m).map(c => (
            <View key={c.name + c.time} style={[row, { gap: 12, paddingVertical: 9, paddingHorizontal: 16 }]}>
              <Avatar src={BYNAME[c.name]} initials={initials(c.name)} size={48} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Txt size={14} w={600} color={c.kind === 'missed' ? RED : slate[900]}>{c.name}</Txt>
                <View style={[row, { gap: 5 }]}>
                  <Icon name={c.kind === 'in' ? 'IconPhoneIncoming' : c.kind === 'out' ? 'IconPhoneOutgoing' : 'IconPhoneMissed'} size={13} color={slate[500]} />
                  <Txt size={12} color={slate[500]}>{c.time}</Txt>
                </View>
              </View>
              <Btn onPress={() => a.startCall(c.name)} accessibilityLabel="Call" style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: T.soft, ...center }}>
                <Icon name={c.video ? 'IconVideo' : 'IconPhone'} size={18} color={T.accent} />
              </Btn>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}
