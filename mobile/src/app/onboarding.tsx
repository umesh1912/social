import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { IMG } from '../data';
import { useDuo } from '../store';
import { G, INDIGO, PINK, PLUM, slate } from '../theme';
import { useDesignInsets } from '../components/insets';
import { Btn, DSButton, Gradient, GradientText, Icon, Img, Scrim, Txt, center, row, type IconName } from '../components/ui';
import type { Grad } from '../theme';

const COLLAGE = [1018, 1, 1011, 180, 1060, 1058, 1031, 1025];

export default function Onboarding() {
  const { s, a } = useDuo();
  const next = () => (s.step < 2 ? a.set({ step: s.step + 1 }) : a.set({ onboarding: false }));
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {s.step === 0 && <Welcome onNext={next} />}
      {s.step === 1 && (
        <Step
          bars={[PINK, slate[200]]} icon="IconHeart" iconGrad={G.personal135} focus={PINK}
          title="Your Personal side" sub="Friends find you by name and phone number."
          fields={[
            { label: 'Full name', key: 'name', placeholder: 'Alex Rivera' },
            { label: 'Phone number', key: 'phone', placeholder: '+1 (510) 555-0142', keyboard: 'phone-pad' },
          ]}
          noteIcon="IconLock" note="Only friends can see your number."
          cta="Continue" ctaGrad={G.personal90} onNext={next}
        />
      )}
      {s.step === 2 && (
        <Step
          bars={[PLUM, INDIGO]} icon="IconBriefcase" iconGrad={G.work135} focus={INDIGO}
          title="Your Work side" sub="Verify your workplace to earn a badge colleagues trust."
          fields={[
            { label: 'Role', key: 'role', placeholder: 'Product Designer' },
            { label: 'Company', key: 'company', placeholder: 'Northwind' },
            { label: 'Work email', key: 'workEmail', placeholder: 'alex@northwind.com', keyboard: 'email-address' },
          ]}
          noteIcon="IconShieldCheck" note="We send a one-time code. Your email stays private."
          cta="Verify and continue" ctaGrad={G.work90} onNext={next} skip
        />
      )}
    </View>
  );
}

function CTA({ label, g, onPress }: { label: string; g: Grad; onPress: () => void }) {
  return (
    <Btn onPress={onPress} style={{ borderRadius: 40, overflow: 'hidden' }}>
      <Gradient g={g} style={{ height: 52, ...center }}>
        <Txt size={15} w={600} color="#fff">{label}</Txt>
      </Gradient>
    </Btn>
  );
}

function Welcome({ onNext }: { onNext: () => void }) {
  const ins = useDesignInsets();
  return (
    <>
      <Gradient g={G.brand160} style={{ height: 430, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', left: -40, right: -40, top: 70, flexDirection: 'row', flexWrap: 'wrap', gap: 10, transform: [{ rotate: '-8deg' }] }}>
          {COLLAGE.map((id, i) => (
            <View key={id} style={{ width: '22.6%', flexGrow: 1, marginTop: i % 2 ? 40 : 0 }}>
              <Img src={IMG(id)} style={{ width: '100%', height: 150, borderRadius: 14 }} />
            </View>
          ))}
        </View>
        <Scrim stops={[['rgba(255,255,255,0)', 0], ['#fff', 1]]} style={{ top: 430 - 160 }} />
      </Gradient>
      <View style={{ flex: 1, gap: 18, paddingHorizontal: 24, paddingBottom: ins.bottom(44) + 10, marginTop: -30, zIndex: 1 }}>
        <View>
          <Txt size={28} w={800} ls={-0.03} lh={1.1}>One account.</Txt>
          <GradientText g={G.textBrand} size={28} w={800} ls={-0.03} lh={1.1}>Two circles.</GradientText>
        </View>
        <Txt size={14} lh={1.5} color={slate[600]}>
          Friends and family on one side, colleagues and careers on the other. Neither sees the other unless you choose.
        </Txt>
        <View style={{ flex: 1 }} />
        <CTA label="Get started" g={G.brand90} onPress={onNext} />
      </View>
    </>
  );
}

type Field = { label: string; key: 'name' | 'phone' | 'role' | 'company' | 'workEmail'; placeholder: string; keyboard?: 'phone-pad' | 'email-address' };

function Step(p: {
  bars: [string, string]; icon: IconName; iconGrad: Grad; focus: string; title: string; sub: string; fields: Field[];
  noteIcon: IconName; note: string; cta: string; ctaGrad: Grad; onNext: () => void; skip?: boolean;
}) {
  const { s, a } = useDuo();
  const ins = useDesignInsets();
  const [focused, setFocused] = useState<string | null>(null);
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ paddingTop: ins.top(70), paddingHorizontal: 24, gap: 6 }}>
          <View style={[row, { gap: 6, marginBottom: 22 }]}>
            {p.bars.map((c, i) => <View key={i} style={{ height: 4, flex: 1, borderRadius: 40, backgroundColor: c }} />)}
          </View>
          <Gradient g={p.iconGrad} style={{ width: 52, height: 52, borderRadius: 16, ...center, marginBottom: 10 }}>
            <Icon name={p.icon} size={24} color="#fff" />
          </Gradient>
          <Txt size={22} w={700} ls={-0.02}>{p.title}</Txt>
          <Txt size={13} color={slate[500]}>{p.sub}</Txt>
        </View>
        <View style={{ flex: 1, gap: p.fields.length > 2 ? 14 : 16, padding: 24, paddingBottom: p.skip ? 24 : 24 + 20 }}>
          {p.fields.map(f => (
            <View key={f.key} style={{ gap: 6 }}>
              <Txt size={13} w={500}>{f.label}</Txt>
              <TextInput
                value={s[f.key]}
                onChangeText={v => a.set({ [f.key]: v })}
                placeholder={f.placeholder}
                placeholderTextColor={slate[400]}
                keyboardType={f.keyboard}
                autoCapitalize={f.keyboard === 'email-address' ? 'none' : undefined}
                onFocus={() => setFocused(f.key)}
                onBlur={() => setFocused(null)}
                style={{
                  height: 48, borderRadius: 10, paddingHorizontal: 14, fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: slate[900], outlineStyle: 'none',
                  boxShadow: focused === f.key ? `inset 0 0 0 2px ${p.focus}` : `inset 0 0 0 1px ${slate[300]}`,
                } as object}
              />
            </View>
          ))}
          <View style={[row, { gap: 8 }]}>
            <Icon name={p.noteIcon} size={14} color={slate[500]} />
            <Txt size={12} color={slate[500]}>{p.note}</Txt>
          </View>
          <View style={{ flex: 1, minHeight: 16 }} />
          <CTA label={p.cta} g={p.ctaGrad} onPress={p.onNext} />
          {p.skip && <DSButton variant="ghost" label="Skip for now" onPress={p.onNext} style={{ width: '100%', height: 44, marginBottom: 12 }} />}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
