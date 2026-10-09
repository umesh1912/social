import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { BYNAME, IMG, STORIES, firstName } from '../data';
import { useDuo } from '../store';
import { PINK } from '../theme';
import { useDesignInsets } from '../components/insets';
import { Avatar, Btn, Icon, Img, Scrim, Txt, center, fill, row } from '../components/ui';

/** Full-screen stories: 1.6% every 80ms per frame (~5s), then the next frame, then the next person. */
export default function Story() {
  const { i = '0' } = useLocalSearchParams<{ i: string }>();
  const { s, a } = useDuo();
  const ins = useDesignInsets();
  const list = STORIES[s.mode];
  const [pos, setPos] = useState({ story: Math.min(Number(i) || 0, list.length - 1), frame: 0, p: 0 });
  const cur = list[pos.story] || list[0];

  useEffect(() => {
    a.set(st => ({ seen: { ...st.seen, [cur.id]: true } }));
  }, [cur.id, a]);

  useEffect(() => {
    const t = setInterval(() => {
      setPos(ps => {
        const c = list[ps.story];
        if (!c) return ps;
        if (ps.p + 1.6 < 100) return { ...ps, p: ps.p + 1.6 };
        if (ps.frame < c.frames.length - 1) return { ...ps, frame: ps.frame + 1, p: 0 };
        if (ps.story < list.length - 1) return { story: ps.story + 1, frame: 0, p: 0 };
        return { ...ps, p: 100 };
      });
    }, 80);
    return () => clearInterval(t);
  }, [list]);

  const done = pos.p >= 100 && pos.story === list.length - 1 && pos.frame === cur.frames.length - 1;
  useEffect(() => {
    if (done) a.closeOverlay();
  }, [done, a]);

  const liked = !!s.storyLiked[cur.id];

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar style="light" />
      <Img src={IMG(cur.frames[pos.frame] ?? cur.frames[0])} style={fill} />
      <Scrim stops={[['rgba(0,0,0,.5)', 0], ['rgba(0,0,0,0)', 0.25], ['rgba(0,0,0,0)', 0.6], ['rgba(0,0,0,.7)', 1]]} />
      <Pressable onPress={() => setPos(ps => ({ ...ps, p: 99 }))} style={{ position: 'absolute', top: 120, bottom: 110, left: 0, right: 0 }} accessibilityLabel="Next" />

      <View style={{ position: 'absolute', left: 12, right: 12, top: ins.top(56), gap: 12 }}>
        <View style={[row, { gap: 4 }]}>
          {cur.frames.map((_, k) => (
            <View key={k} style={{ flex: 1, height: 3, borderRadius: 40, backgroundColor: 'rgba(255,255,255,.35)', overflow: 'hidden' }}>
              <View style={{ height: '100%', width: `${k < pos.frame ? 100 : k === pos.frame ? Math.min(pos.p, 100) : 0}%`, backgroundColor: '#fff' }} />
            </View>
          ))}
        </View>
        <View style={[row, { gap: 10 }]}>
          <Avatar src={BYNAME[cur.name]} size={36} style={{ boxShadow: '0 0 0 2px #fff' }} />
          <Txt size={13} w={700} color="#fff" style={{ flex: 1 }}>
            {cur.name} <Txt size={13} w={500} color="rgba(255,255,255,.75)">{cur.time}</Txt>
          </Txt>
          <Btn onPress={a.closeOverlay} accessibilityLabel="Close" style={{ width: 36, height: 36, ...center }}>
            <Icon name="IconX" size={24} color="#fff" />
          </Btn>
        </View>
      </View>

      <Txt size={20} w={800} ls={-0.02} lh={1.15} color="#fff" style={{ position: 'absolute', left: 20, right: 20, bottom: 110, textShadowColor: 'rgba(0,0,0,.35)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10 }}>
        {cur.caps[pos.frame] || ''}
      </Txt>

      <View style={[row, { position: 'absolute', left: 12, right: 12, bottom: ins.bottom(36), gap: 8 }]}>
        <TextInput
          placeholder={'Reply to ' + firstName(cur.name)}
          placeholderTextColor="rgba(255,255,255,.75)"
          style={{ flex: 1, height: 46, borderRadius: 40, paddingHorizontal: 18, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', backgroundColor: 'rgba(0,0,0,.2)', color: '#fff', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.55)', outlineStyle: 'none' } as object}
        />
        <Btn onPress={() => a.set(st => ({ storyLiked: { ...st.storyLiked, [cur.id]: !liked } }))} accessibilityLabel="Like" style={{ width: 46, height: 46, ...center }}>
          <Icon name="IconHeart" size={26} color={liked ? PINK : '#fff'} />
        </Btn>
      </View>
    </View>
  );
}
