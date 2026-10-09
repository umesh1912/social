import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { A, IMG, type Audience } from '../data';
import { useDuo } from '../store';
import { BOTH, slate, TH, type Theme } from '../theme';
import { useDesignInsets } from '../components/insets';
import { Avatar, Btn, DSButton, Gradient, Icon, Img, Txt, center, fill, row, type IconName } from '../components/ui';

type Aud = Exclude<Audience, 'Public'> | 'Everyone';
const EVERYONE: Theme = { ...BOTH, grad: { angle: 135, colors: ['#db4e66', '#a24688', '#4e3aba'] } };
const AUDIENCES: [Aud, IconName, string, Theme][] = [
  ['Friends', 'IconHeart', 'Personal only', TH.personal],
  ['Colleagues', 'IconBriefcase', 'Work only', TH.work],
  ['Everyone', 'IconGlobe', 'Both spaces', EVERYONE],
];

export default function Compose() {
  const { s, a } = useDuo();
  const ins = useDesignInsets();
  const isW = s.mode === 'work';
  const [text, setText] = useState('');
  const [img, setImg] = useState(false);
  const [audience, setAudience] = useState<Aud | null>(null);
  const aud = audience || (isW ? 'Colleagues' : 'Friends');
  const AT = aud === 'Friends' ? TH.personal : aud === 'Colleagues' ? TH.work : BOTH;
  const ready = !!text.trim() || img;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[row, { paddingTop: ins.top(54), paddingHorizontal: 10, paddingBottom: 8, gap: 8 }]}>
        <DSButton variant="ghost" label="Cancel" onPress={a.closeOverlay} />
        <Txt size={15} w={700} center style={{ flex: 1 }}>New post</Txt>
        <Btn onPress={() => a.publish(text, img, audience)} style={{ borderRadius: 40, overflow: 'hidden', opacity: ready ? 1 : 0.45 }}>
          <Gradient g={AT.grad} style={{ height: 38, paddingHorizontal: 18, ...center }}>
            <Txt size={13} w={700} color="#fff">Post</Txt>
          </Gradient>
        </Btn>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 16, gap: 14 }} keyboardShouldPersistTaps="handled">
        <View style={[row, { gap: 8 }]}>
          {AUDIENCES.map(([l, icon, sub, t]) => {
            const on = aud === l;
            const fg = on ? '#fff' : slate[900];
            return (
              <Btn key={l} onPress={() => setAudience(l)} style={{ flex: 1, borderRadius: 18, overflow: 'hidden', backgroundColor: '#fff', boxShadow: on ? undefined : `inset 0 0 0 1px ${slate[200]}` }}>
                {on && <Gradient g={t.grad} style={fill} />}
                <View style={{ paddingVertical: 12, paddingHorizontal: 10, gap: 8 }}>
                  <Icon name={icon} size={20} color={fg} />
                  <View>
                    <Txt size={12} w={700} color={fg}>{l}</Txt>
                    <Txt size={11} color={fg} style={{ opacity: 0.8 }}>{sub}</Txt>
                  </View>
                </View>
              </Btn>
            );
          })}
        </View>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
          <Avatar src={A.me} size={40} />
          <TextInput
            value={text}
            onChangeText={setText}
            multiline
            autoFocus
            placeholder={isW ? 'Share a win or ask your network' : 'What are you up to?'}
            placeholderTextColor={slate[400]}
            style={{ flex: 1, minHeight: 120, fontSize: 16, lineHeight: 23, paddingTop: 8, fontFamily: 'PlusJakartaSans_400Regular', color: slate[900], textAlignVertical: 'top', outlineStyle: 'none' } as object}
          />
        </View>
        {img && (
          <View style={{ borderRadius: 18, overflow: 'hidden' }}>
            <Img src={IMG(1060)} style={{ width: '100%', height: 220 }} />
            <Btn onPress={() => setImg(false)} accessibilityLabel="Remove photo" style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(15,23,42,.7)', ...center }}>
              <Icon name="IconX" size={16} color="#fff" />
            </Btn>
          </View>
        )}
      </ScrollView>
      <View style={[row, { gap: 8, paddingTop: 10, paddingHorizontal: 16, paddingBottom: ins.bottom(36), borderTopWidth: 1, borderTopColor: slate[100] }]}>
        <Btn onPress={() => setImg(v => !v)} style={[row, { flex: 1, height: 44, borderRadius: 40, justifyContent: 'center', gap: 6, backgroundColor: AT.soft }]}>
          <Icon name="IconImage" size={17} color={AT.accent} />
          <Txt size={12} w={600} color={AT.accent}>Photo</Txt>
        </Btn>
        <Btn style={[row, { flex: 1, height: 44, borderRadius: 40, justifyContent: 'center', gap: 6, backgroundColor: slate[100] }]}>
          <Icon name="IconMapPin" size={17} color={slate[700]} />
          <Txt size={12} w={600} color={slate[700]}>Place</Txt>
        </Btn>
        <Btn style={[row, { flex: 1, height: 44, borderRadius: 40, justifyContent: 'center', gap: 6, backgroundColor: slate[100] }]}>
          <Icon name="IconUsers" size={17} color={slate[700]} />
          <Txt size={12} w={600} color={slate[700]}>Tag</Txt>
        </Btn>
      </View>
    </KeyboardAvoidingView>
  );
}
