import { useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { BYNAME, CHATS, GROUPS } from '../../data';
import { useDuo } from '../../store';
import { INDIGO, slate, TH } from '../../theme';
import { useDesignInsets } from '../../components/insets';
import { Avatar, Btn, DSButton, Gradient, Icon, Img, Scrim, Txt, center, fill, row } from '../../components/ui';

export default function Thread() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const { s, a } = useDuo();
  const ins = useDesignInsets();
  const [gTab, setGTab] = useState<'chat' | 'posts'>('chat');
  const [draft, setDraft] = useState('');
  const scroller = useRef<ScrollView>(null);

  const grp = GROUPS[id];
  const isG = !!grp;
  const chat = [...CHATS, ...s.extraChats].find(x => x.id === id);
  const name = chat?.name ?? grp?.name ?? '';
  const cMode = grp?.mode ?? chat?.mode ?? s.mode;
  const CT = TH[cMode];
  const typing = s.typing === id;
  const msgs = s.msgs[id] || [];

  const send = () => {
    a.send(id, draft);
    setDraft('');
  };
  const seg = (on: boolean) => ({ bg: on ? '#fff' : 'transparent', fg: on ? CT.accent : slate[500] });

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {isG ? (
        <>
          <View style={{ height: 200 + ins.top(54) - 54 }}>
            <Img src={grp.cover} style={fill} />
            <Scrim stops={[['rgba(15,23,42,.35)', 0], ['rgba(15,23,42,.1)', 0.4], ['rgba(15,23,42,.8)', 1]]} />
            <Btn onPress={a.closeOverlay} accessibilityLabel="Back" style={{ position: 'absolute', top: ins.top(56), left: 12, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,.92)', ...center }}>
              <Icon name="IconChevronLeft" size={20} />
            </Btn>
            <Btn onPress={() => a.startCall(name)} accessibilityLabel="Group call" style={{ position: 'absolute', top: ins.top(56), right: 12, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,.92)', ...center }}>
              <Icon name="IconVideo" size={18} />
            </Btn>
            <View style={{ position: 'absolute', left: 16, right: 16, bottom: 14 }}>
              <Txt size={19} w={800} ls={-0.02} color="#fff">{grp.name}</Txt>
              <Txt size={12} color="rgba(255,255,255,.9)">{grp.members} · {grp.privacy}</Txt>
            </View>
          </View>
          <View style={{ paddingVertical: 12, paddingHorizontal: 16, gap: 10, borderBottomWidth: 1, borderBottomColor: slate[100] }}>
            <Txt size={12} lh={1.45} color={slate[600]}>{grp.desc}</Txt>
            <View style={{ flexDirection: 'row', padding: 4, backgroundColor: slate[100], borderRadius: 40 }}>
              {(['chat', 'posts'] as const).map(t => (
                <Btn key={t} onPress={() => setGTab(t)} style={{ flex: 1, height: 32, borderRadius: 40, backgroundColor: seg(gTab === t).bg, ...center }}>
                  <Txt size={13} w={600} color={seg(gTab === t).fg}>{t === 'chat' ? 'Chat' : 'Posts'}</Txt>
                </Btn>
              ))}
            </View>
          </View>
        </>
      ) : (
        <View style={[row, { paddingTop: ins.top(54), paddingHorizontal: 10, paddingBottom: 10, gap: 8, backgroundColor: '#fff', boxShadow: `0 1px 0 ${slate[100]}`, zIndex: 1 }]}>
          <DSButton variant="ghost" onPress={a.closeOverlay} accessibilityLabel="Back" style={{ width: 40, height: 40, paddingHorizontal: 0 }}>
            <Icon name="IconChevronLeft" size={22} />
          </DSButton>
          <View>
            <Avatar src={BYNAME[name]} size={40} />
            <View style={{ position: 'absolute', right: 0, bottom: 0, width: 11, height: 11, borderRadius: 9, backgroundColor: CT.accent, boxShadow: '0 0 0 2px #fff' }} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={[row, { gap: 4 }]}>
              <Txt size={14} w={700}>{name}</Txt>
              {chat?.verified && <Icon name="IconShieldCheck" size={14} color={INDIGO} />}
            </View>
            <Txt size={11} color={slate[500]} numberOfLines={1}>{typing ? 'typing…' : chat?.sub || ''}</Txt>
          </View>
          <Btn onPress={() => a.startCall(name)} accessibilityLabel="Video call" style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: CT.soft, ...center }}>
            <Icon name="IconVideo" size={19} color={CT.accent} />
          </Btn>
          <Btn onPress={() => a.startCall(name)} accessibilityLabel="Call" style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: CT.soft, ...center }}>
            <Icon name="IconPhone" size={18} color={CT.accent} />
          </Btn>
        </View>
      )}

      {isG && gTab === 'posts' ? (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 6 }}>
          {grp.posts.map((gp, i) => (
            <View key={i} style={{ paddingVertical: 14, paddingHorizontal: 16, gap: 10, borderBottomWidth: 1, borderBottomColor: slate[100] }}>
              <View style={[row, { gap: 10 }]}>
                <Avatar src={BYNAME[gp.a]} size={36} />
                <View style={{ flex: 1 }}>
                  <Txt size={13} w={600}>{gp.a}</Txt>
                  <Txt size={11} color={slate[500]}>{gp.time}</Txt>
                </View>
              </View>
              <Txt size={14} lh={1.5}>{gp.t}</Txt>
              {gp.img && <Img src={gp.img} style={{ width: '100%', height: 200, borderRadius: 16 }} />}
            </View>
          ))}
        </ScrollView>
      ) : (
        <>
          <ScrollView
            ref={scroller}
            style={{ flex: 1, backgroundColor: CT.tint }}
            contentContainerStyle={{ paddingVertical: 14, paddingHorizontal: 12, gap: 6 }}
            onContentSizeChange={() => scroller.current?.scrollToEnd({ animated: false })}
            keyboardDismissMode="interactive"
          >
            <View style={[row, { alignSelf: 'center', gap: 6, backgroundColor: '#fff', borderRadius: 40, paddingVertical: 5, paddingHorizontal: 11, marginBottom: 8 }]}>
              <Icon name={cMode === 'work' ? 'IconBriefcase' : 'IconLock'} size={12} color={CT.accent} />
              <Txt size={11} w={600} color={CT.accent}>{cMode === 'work' ? 'Work chat · stays in your Work space' : 'Personal chat · end-to-end encrypted'}</Txt>
            </View>
            {msgs.map((x, i) => {
              if (x.f === 'me') {
                return (
                  <Gradient key={i} g={CT.grad} style={{ alignSelf: 'flex-end', maxWidth: '78%', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 6, paddingVertical: 9, paddingHorizontal: 13, boxShadow: `0 2px 6px ${TH[s.mode].shadow}` }}>
                    <Txt size={14} lh={1.4} color="#fff">{x.t}</Txt>
                    <View style={[row, { gap: 3, justifyContent: 'flex-end', marginTop: 2 }]}>
                      <Txt size={10} color="rgba(255,255,255,.75)">{x.at}</Txt>
                      <Icon name="IconCheckCheck" size={12} color="rgba(255,255,255,.75)" />
                    </View>
                  </Gradient>
                );
              }
              const who = isG && x.f !== 'them' ? x.f : '';
              const whoSrc = isG ? BYNAME[x.f] : '';
              return (
                <View key={i} style={[row, { alignSelf: 'flex-start', gap: 6, alignItems: 'flex-end', maxWidth: '84%' }]}>
                  {!!whoSrc && <Avatar src={whoSrc} size={26} />}
                  <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20, borderBottomLeftRadius: 6, paddingVertical: 9, paddingHorizontal: 13, boxShadow: '0 1px 2px rgba(15,23,42,.06)', flexShrink: 1 }}>
                    {!!who && <Txt size={11} w={700} color={CT.accent} style={{ marginBottom: 2 }}>{who}</Txt>}
                    {x.img && <Img src={x.img} style={{ width: 210, height: 150, borderRadius: 14, marginTop: 2, marginBottom: 4 }} />}
                    {!!x.t && <Txt size={14} lh={1.4}>{x.t}</Txt>}
                    <Txt size={10} color={slate[400]} style={{ textAlign: 'right', marginTop: 2 }}>{x.at}</Txt>
                  </View>
                </View>
              );
            })}
            {typing && (
              <View style={{ alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 20, paddingVertical: 9, paddingHorizontal: 14 }}>
                <Txt size={12} color={slate[500]}>typing…</Txt>
              </View>
            )}
          </ScrollView>
          <View style={[row, { paddingTop: 8, paddingHorizontal: 10, paddingBottom: ins.bottom(34), gap: 8, backgroundColor: '#fff' }]}>
            <Btn accessibilityLabel="Attach" style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: slate[100], ...center }}>
              <Icon name="IconPlus" size={20} color={slate[600]} />
            </Btn>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={send}
              submitBehavior="submit"
              returnKeyType="send"
              placeholder="Message"
              placeholderTextColor={slate[400]}
              style={{ flex: 1, height: 42, backgroundColor: slate[100], borderRadius: 40, paddingHorizontal: 16, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: slate[900], outlineStyle: 'none' } as object}
            />
            <Btn onPress={send} accessibilityLabel="Send" style={{ width: 42, height: 42, borderRadius: 21, overflow: 'hidden' }}>
              <Gradient g={CT.grad} style={[fill, center]}>
                <Icon name={draft.trim() ? 'IconSend' : 'IconMic'} size={18} color="#fff" />
              </Gradient>
            </Btn>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}
