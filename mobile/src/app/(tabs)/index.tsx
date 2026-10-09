import React, { useRef } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { A, BYNAME, IMG, STORIES, firstName, type Post } from '../../data';
import { useDuo } from '../../store';
import { G, INDIGO, PINK, slate, TH } from '../../theme';
import { Avatar, Btn, Gradient, Icon, Img, Scrim, Txt, center, fill, row, type IconName } from '../../components/ui';

const AUD: Record<Post['aud'], { icon: IconName; bg: string; fg: string }> = {
  Friends: { icon: 'IconHeart', bg: '#fce7eb', fg: PINK },
  Colleagues: { icon: 'IconBriefcase', bg: '#e4e0f7', fg: INDIGO },
  Public: { icon: 'IconGlobe', bg: slate[100], fg: slate[700] },
};

export default function Home() {
  const { s, a } = useDuo();
  const m = s.mode, T = TH[m], isW = m === 'work';
  const posts = s.posts.filter(p => p.mode === m || p.mode === 'both');

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: T.tint, paddingTop: 6, paddingBottom: 18, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 16 }}>
          <Btn onPress={a.openCompose} style={{ width: 96, height: 150, borderRadius: 16, overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 1px 2px rgba(15,23,42,.08)' }}>
            <Img src={A.me} style={{ width: '100%', height: 96 }} />
            <Gradient g={T.grad} style={{ position: 'absolute', left: 32, top: 80, width: 32, height: 32, borderRadius: 16, ...center, boxShadow: '0 0 0 3px #fff' }}>
              <Icon name="IconPlus" size={18} color="#fff" />
            </Gradient>
            <Txt size={11} w={600} center style={{ position: 'absolute', bottom: 10, left: 0, right: 0 }}>{isW ? 'Add update' : 'Your story'}</Txt>
          </Btn>
          {STORIES[m].map((st, i) => {
            const seen = !!s.seen[st.id];
            return (
              <Btn key={st.id} onPress={() => a.openStory(i)} style={{ width: 96, height: 150, borderRadius: 16, overflow: 'hidden', backgroundColor: slate[900] }}>
                <Img src={IMG(st.frames[0])} style={[fill, { opacity: seen ? 0.55 : 1 }]} />
                <Scrim stops={[['rgba(15,23,42,0)', 0.45], ['rgba(15,23,42,.75)', 1]]} />
                <View style={{ position: 'absolute', top: 8, left: 8, width: 36, height: 36, borderRadius: 18, padding: 2, overflow: 'hidden' }}>
                  {seen ? <View style={[fill, { backgroundColor: slate[300] }]} /> : <Gradient g={T.grad} style={fill} />}
                  <Avatar src={BYNAME[st.name]} size={32} style={{ boxShadow: '0 0 0 2px #fff' }} />
                </View>
                <Txt size={11} w={600} color="#fff" style={{ position: 'absolute', bottom: 9, left: 9, right: 9 }}>{firstName(st.name)}</Txt>
              </Btn>
            );
          })}
        </ScrollView>
        <Btn onPress={a.openCompose} style={[row, { marginTop: 14, marginHorizontal: 16, backgroundColor: '#fff', gap: 10, padding: 8, borderRadius: 40, boxShadow: '0 1px 2px rgba(15,23,42,.08)' }]}>
          <Avatar src={A.me} size={34} />
          <Txt size={13} color={slate[500]} style={{ flex: 1 }}>{isW ? 'Share a win or ask your network' : 'What are you up to?'}</Txt>
          <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: T.soft, ...center }}>
            <Icon name="IconImage" size={17} color={T.accent} />
          </View>
        </Btn>
      </View>

      {isW && (
        <Gradient g={G.work135} style={[row, { marginTop: 16, marginHorizontal: 16, padding: 16, borderRadius: 18, gap: 12 }]}>
          <Avatar src={A.aisha} size={44} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Txt size={11} w={500} color="rgba(255,255,255,.8)">New endorsement</Txt>
            <Txt size={13} w={600} lh={1.35} color="#fff">Aisha Bello vouched for your Prototyping</Txt>
          </View>
          <Btn
            onPress={() => { if (s.endorsed) return; a.set({ endorsed: true }); a.flash('You endorsed Aisha for Hiring'); }}
            style={{ backgroundColor: '#fff', height: 34, paddingHorizontal: 12, borderRadius: 40, ...center }}
          >
            <Txt size={12} w={600} color={INDIGO}>{s.endorsed ? 'Endorsed' : 'Endorse back'}</Txt>
          </Btn>
        </Gradient>
      )}

      {posts.map(p => <PostCard key={p.id} p={p} />)}
    </ScrollView>
  );
}

function PostCard({ p }: { p: Post }) {
  const { s, a } = useDuo();
  const T = TH[s.mode], isW = s.mode === 'work';
  const liked = !!s.liked[p.id], saved = !!s.saved[p.id];
  const aud = AUD[p.aud];
  const like = () => a.set(st => ({ liked: { ...st.liked, [p.id]: !st.liked[p.id] } }));
  const lastTap = useRef(0);
  const onImageTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) { like(); lastTap.current = 0; } else lastTap.current = now;
  };

  return (
    <View style={{ paddingTop: 18, paddingHorizontal: 16, paddingBottom: 4, gap: 12 }}>
      <View style={[row, { gap: 10 }]}>
        <Avatar src={p.src || BYNAME[p.author]} size={42} />
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <View style={[row, { gap: 4 }]}>
            <Txt size={13} w={600}>{p.author}</Txt>
            {p.verified && <Icon name="IconShieldCheck" size={15} color={INDIGO} />}
          </View>
          <View style={[row, { gap: 4 }]}>
            <Txt size={11} color={slate[500]} numberOfLines={1} style={{ flexShrink: 1 }}>{p.meta}</Txt>
            <Txt size={11} color={slate[500]}>·</Txt>
            <Txt size={11} color={slate[500]}>{p.time}</Txt>
          </View>
        </View>
        <View style={[row, { gap: 4, height: 24, paddingHorizontal: 8, borderRadius: 40, backgroundColor: aud.bg }]}>
          <Icon name={aud.icon} size={11} color={aud.fg} />
          <Txt size={11} w={600} color={aud.fg}>{p.aud}</Txt>
        </View>
      </View>

      {!!p.text && <Txt size={14} lh={1.5}>{p.text}</Txt>}

      {p.img && (
        <Pressable onPress={onImageTap} style={{ borderRadius: 18, overflow: 'hidden' }}>
          <Img src={p.img} style={{ width: '100%', height: p.imgH ?? 260 }} />
        </Pressable>
      )}

      {p.album && (
        <View style={{ flexDirection: 'row', gap: 4, height: 264, borderRadius: 18, overflow: 'hidden' }}>
          <Img src={IMG(1015)} style={{ flex: 2, height: '100%' }} />
          <View style={{ flex: 1, gap: 4 }}>
            <Img src={IMG(1011)} style={{ flex: 1, width: '100%' }} />
            <View style={{ flex: 1 }}>
              <Img src={IMG(1039)} style={fill} />
              <View style={[fill, center, { backgroundColor: 'rgba(15,23,42,.55)' }]}>
                <Txt size={17} w={700} color="#fff">+11</Txt>
              </View>
            </View>
          </View>
        </View>
      )}

      {p.job && (
        <View style={{ borderRadius: 18, overflow: 'hidden', boxShadow: `inset 0 0 0 1px ${slate[200]}` }}>
          <View style={{ height: 120 }}>
            <Img src={IMG(1)} style={fill} />
            <Scrim stops={[['rgba(78,58,186,0)', 0], ['rgba(78,58,186,.7)', 1]]} />
            <View style={[row, { position: 'absolute', left: 14, bottom: 12, gap: 6 }]}>
              <Icon name="IconUsers" size={13} color="#fff" />
              <Txt size={11} w={600} color="#fff">Priya can refer you</Txt>
            </View>
          </View>
          <View style={[row, { gap: 12, paddingVertical: 12, paddingHorizontal: 14 }]}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Txt size={14} w={600}>{p.jobTitle}</Txt>
              <Txt size={11} color={slate[500]}>{p.jobCo}</Txt>
            </View>
            <Btn onPress={a.goJobs} style={{ borderRadius: 40, overflow: 'hidden' }}>
              <Gradient g={G.work90} style={{ height: 36, paddingHorizontal: 14, ...center }}>
                <Txt size={12} w={600} color="#fff">See role</Txt>
              </Gradient>
            </Btn>
          </View>
        </View>
      )}

      <View style={[row, { gap: 2, marginHorizontal: -8 }]}>
        <Btn onPress={like} style={[row, { gap: 6, height: 36, paddingHorizontal: 12, borderRadius: 40, backgroundColor: liked ? T.soft : 'transparent' }]}>
          <Icon name={isW ? 'IconThumbsUp' : 'IconHeart'} size={18} color={liked ? T.accent : slate[600]} />
          <Txt size={12} w={600} color={liked ? T.accent : slate[600]}>{p.likes + (liked ? 1 : 0)}</Txt>
        </Btn>
        <Btn hoverBg={slate[100]} style={[row, { gap: 6, height: 36, paddingHorizontal: 10, borderRadius: 40 }]}>
          <Icon name="IconMessageCircle" size={18} color={slate[600]} />
          <Txt size={12} w={500} color={slate[600]}>{p.comments}</Txt>
        </Btn>
        <Btn hoverBg={slate[100]} onPress={() => { a.set({ chatTab: 'chats' }); a.goTab('chats'); }} style={[row, { gap: 6, height: 36, paddingHorizontal: 10, borderRadius: 40 }]}>
          <Icon name="IconSend" size={18} color={slate[600]} />
          <Txt size={12} w={500} color={slate[600]}>Send</Txt>
        </Btn>
        <View style={{ flex: 1 }} />
        <Btn
          hoverBg={slate[100]}
          accessibilityLabel="Save"
          onPress={() => { a.set(st => ({ saved: { ...st.saved, [p.id]: !saved } })); a.flash(saved ? 'Removed from saved' : 'Saved'); }}
          style={[row, { height: 36, paddingHorizontal: 10, borderRadius: 40 }]}
        >
          <Icon name="IconBookmark" size={18} color={saved ? T.accent : slate[400]} />
        </Btn>
      </View>
      <View style={{ height: 1, backgroundColor: slate[100], marginTop: 6 }} />
    </View>
  );
}
