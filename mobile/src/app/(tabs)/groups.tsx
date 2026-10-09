import React from 'react';
import { ScrollView, View } from 'react-native';
import { GROUPS } from '../../data';
import { useDuo } from '../../store';
import { PINK, slate } from '../../theme';
import { Avatar, Btn, DSButton, Icon, Img, Scrim, Txt, fill, row } from '../../components/ui';

export default function Groups() {
  const { s, a } = useDuo();
  const groups = Object.entries(GROUPS).filter(([, g]) => g.mode === 'personal');
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 6, paddingHorizontal: 16, paddingBottom: 110, gap: 14 }} showsVerticalScrollIndicator={false}>
      {groups.map(([id, g]) => {
        const unread = s.read[id] ? 0 : g.unread;
        return (
          <Btn key={id} onPress={() => a.openChat(id)} style={{ height: 168, borderRadius: 20, overflow: 'hidden', backgroundColor: slate[900] }}>
            <Img src={g.cover} style={fill} />
            <Scrim stops={[['rgba(15,23,42,.05)', 0.2], ['rgba(15,23,42,.8)', 1]]} />
            <View style={[row, { position: 'absolute', top: 12, left: 12, height: 24, paddingHorizontal: 9, borderRadius: 40, backgroundColor: 'rgba(255,255,255,.92)', gap: 4 }]}>
              <Icon name={g.privacy === 'Private' ? 'IconLock' : 'IconGlobe'} size={11} />
              <Txt size={11} w={600}>{g.privacy}</Txt>
            </View>
            {!!unread && (
              <View style={[row, { position: 'absolute', top: 12, right: 12, height: 24, paddingHorizontal: 9, borderRadius: 40, backgroundColor: PINK }]}>
                <Txt size={11} w={700} color="#fff">{unread} new</Txt>
              </View>
            )}
            <View style={[row, { position: 'absolute', left: 14, right: 14, bottom: 12, alignItems: 'flex-end', gap: 10 }]}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Txt size={16} w={700} ls={-0.01} color="#fff">{g.name}</Txt>
                <Txt size={11} color="rgba(255,255,255,.85)" numberOfLines={1}>{g.activity}</Txt>
              </View>
              <View style={[row, { paddingLeft: 8 }]}>
                {(g.faces || []).map(f => <Avatar key={f} src={f} size={26} style={{ marginLeft: -8, boxShadow: `0 0 0 2px ${slate[900]}` }} />)}
              </View>
            </View>
          </Btn>
        );
      })}
      <DSButton variant="outline" label="Create a group" onPress={() => a.flash('Pick friends to start a group')} style={{ height: 44 }} />
    </ScrollView>
  );
}
