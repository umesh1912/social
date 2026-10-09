import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { BYNAME, initials } from '../data';
import { useDuo } from '../store';
import { RED, slate, TH } from '../theme';
import { useDesignInsets } from '../components/insets';
import { Avatar, Btn, Gradient, Icon, Txt, center } from '../components/ui';

export default function Call() {
  const { name = '' } = useLocalSearchParams<{ name: string }>();
  const { s, a } = useDuo();
  const ins = useDesignInsets();
  const [secs, setSecs] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSecs(x => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const talk = Math.max(0, secs - 3);
  const label = secs < 3 ? 'Ringing…' : Math.floor(talk / 60) + ':' + String(talk % 60).padStart(2, '0');
  const end = () => { a.closeOverlay(); a.flash('Call ended'); };
  const circle = { width: 66, height: 66, borderRadius: 33, ...center };

  return (
    <Gradient g={TH[s.mode].grad} style={{ flex: 1, alignItems: 'center', paddingTop: ins.top(130), paddingHorizontal: 24, paddingBottom: ins.bottom(70), overflow: 'hidden' }}>
      <StatusBar style="light" />
      <View style={{ width: 150, height: 150, ...center }}>
        <View style={{ position: 'absolute', top: -26, left: -26, right: -26, bottom: -26, borderRadius: 999, backgroundColor: 'rgba(255,255,255,.08)' }} />
        <View style={{ position: 'absolute', top: -12, left: -12, right: -12, bottom: -12, borderRadius: 999, backgroundColor: 'rgba(255,255,255,.12)' }} />
        <Avatar src={BYNAME[name]} initials={initials(name)} size={150} />
      </View>
      <Txt size={24} w={800} ls={-0.02} color="#fff" style={{ marginTop: 40 }}>{name}</Txt>
      <Txt size={14} color="rgba(255,255,255,.8)" style={{ marginTop: 6 }}>{label}</Txt>
      <View style={{ flex: 1 }} />
      <View style={{ flexDirection: 'row', gap: 26 }}>
        <Btn onPress={() => setMuted(m => !m)} accessibilityLabel="Mute" accessibilityState={{ selected: muted }} style={[circle, { backgroundColor: muted ? '#fff' : 'rgba(255,255,255,.2)' }]}>
          <Icon name="IconMicOff" size={24} color={muted ? slate[900] : '#fff'} />
        </Btn>
        <Btn accessibilityLabel="Video" style={[circle, { backgroundColor: 'rgba(255,255,255,.2)' }]}>
          <Icon name="IconVideo" size={24} color="#fff" />
        </Btn>
        <Btn onPress={end} accessibilityLabel="End call" style={[circle, { backgroundColor: RED }]}>
          <Icon name="IconPhoneOff" size={24} color="#fff" />
        </Btn>
      </View>
    </Gradient>
  );
}
