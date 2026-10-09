// Seed content for the Duo prototype. Mirrors the data in "Duo App v3.dc.html".
import type { ImageSourcePropType } from 'react-native';
import type { Mode } from './theme';

const RU = (g: 'men' | 'women', n: number) => `https://randomuser.me/api/portraits/${g}/${n}.jpg`;

export const A = {
  maya: RU('women', 44), rahul: RU('men', 32), lea: RU('women', 68), jonah: RU('men', 75), priya: RU('women', 65),
  daniel: RU('men', 46), sam: RU('men', 86), aisha: RU('women', 79), kenji: RU('men', 52), tomas: RU('men', 22),
  nina: RU('women', 33), ines: RU('women', 12), me: RU('men', 36), mom: RU('women', 90), dad: RU('men', 91),
};

const PHOTOS: Record<number, ImageSourcePropType> = {
  1: require('../assets/photos/p1.jpg'),
  3: require('../assets/photos/p3.jpg'),
  8: require('../assets/photos/p8.jpg'),
  60: require('../assets/photos/p60.jpg'),
  180: require('../assets/photos/p180.jpg'),
  429: require('../assets/photos/p429.jpg'),
  431: require('../assets/photos/p431.jpg'),
  1011: require('../assets/photos/p1011.jpg'),
  1012: require('../assets/photos/p1012.jpg'),
  1015: require('../assets/photos/p1015.jpg'),
  1018: require('../assets/photos/p1018.jpg'),
  1025: require('../assets/photos/p1025.jpg'),
  1031: require('../assets/photos/p1031.jpg'),
  1039: require('../assets/photos/p1039.jpg'),
  1043: require('../assets/photos/p1043.jpg'),
  1058: require('../assets/photos/p1058.jpg'),
  1060: require('../assets/photos/p1060.jpg'),
  1067: require('../assets/photos/p1067.jpg'),
  1080: require('../assets/photos/p1080.jpg'),
};

export type Img = ImageSourcePropType | string;
export const IMG = (id: number): ImageSourcePropType => PHOTOS[id];

export const BYNAME: Record<string, string> = {
  'Maya Chen': A.maya, 'Rahul Mehta': A.rahul, 'Lea Fischer': A.lea, 'Jonah Park': A.jonah, 'Priya Nair': A.priya,
  'Daniel Ortiz': A.daniel, 'Sam Okafor': A.sam, 'Aisha Bello': A.aisha, 'Kenji Watanabe': A.kenji,
  'Tomás Briones': A.tomas, 'Nina Alvarez': A.nina, 'Inés Duarte': A.ines, Mom: A.mom, Dad: A.dad,
  Jonah: A.jonah, Kenji: A.kenji, Daniel: A.daniel, Aisha: A.aisha, Lea: A.lea,
};

export type Story = { id: string; name: string; time: string; frames: number[]; caps: string[] };
export const STORIES: Record<Mode, Story[]> = {
  personal: [
    { id: 'maya', name: 'Maya Chen', time: '2h', frames: [1018, 1015], caps: ['Summit before 7am', 'Worth every switchback'] },
    { id: 'rahul', name: 'Rahul Mehta', time: '4h', frames: [1039], caps: ['Found a waterfall nobody told us about'] },
    { id: 'lea', name: 'Lea Fischer', time: '6h', frames: [1080, 429], caps: ['Saturday market haul', 'Jam season'] },
    { id: 'jonah', name: 'Jonah Park', time: '9h', frames: [1025], caps: ['Biscuit refuses to go outside'] },
  ],
  work: [
    { id: 'priya', name: 'Priya Nair', time: '1h', frames: [1, 8], caps: ['Offsite day one', 'Roadmap is locked'] },
    { id: 'daniel', name: 'Daniel Ortiz', time: '3h', frames: [180], caps: ['Sketching the next onboarding'] },
    { id: 'aisha', name: 'Aisha Bello', time: '1d', frames: [1067, 1031], caps: ['Speaking at DevDays Chicago', 'Slides are up on my profile'] },
  ],
};

export type Chat = { id: string; mode: Mode; name: string; last: string; time: string; unread: number; sub?: string; group?: boolean; verified?: boolean };
export const CHATS: Chat[] = [
  { id: 'maya', mode: 'personal', name: 'Maya Chen', last: 'Saturday still on? I can drive.', time: '9:41', unread: 2, sub: 'online' },
  { id: 'family', mode: 'personal', name: 'Family', group: true, last: 'Mom: Dinner at 7, bring dessert', time: '9:12', unread: 5 },
  { id: 'rahul', mode: 'personal', name: 'Rahul Mehta', last: 'You: haha fair', time: 'Yesterday', unread: 0, sub: 'last seen today at 8:02' },
  { id: 'football', mode: 'personal', name: 'Sunday Football', group: true, last: 'Jonah: Need 2 more for 10am', time: 'Yesterday', unread: 0 },
  { id: 'lea', mode: 'personal', name: 'Lea Fischer', last: 'Sent a photo', time: 'Mon', unread: 0, sub: 'online' },
  { id: 'priya', mode: 'work', name: 'Priya Nair', verified: true, last: 'Can you share the case study before Thursday?', time: '10:05', unread: 1, sub: 'Product Lead · Northwind' },
  { id: 'guild', mode: 'work', name: 'Design Guild', group: true, last: 'Daniel: Portfolio review thread is up', time: '9:30', unread: 12 },
  { id: 'daniel', mode: 'work', name: 'Daniel Ortiz', last: 'You: Thanks for the intro!', time: 'Yesterday', unread: 0, sub: 'Senior Designer · Lumen' },
  { id: 'nwdesign', mode: 'work', name: 'Northwind Design', group: true, last: 'Aisha: Crit moved to 3pm', time: 'Tue', unread: 0 },
  { id: 'sam', mode: 'work', name: 'Sam Okafor', last: 'Are you open to a quick call this week?', time: 'Mon', unread: 0, sub: 'Recruiter · Fieldstone' },
];

export type GroupPost = { a: string; t: string; time: string; img?: ImageSourcePropType };
export type Group = {
  name: string; cover: ImageSourcePropType; members: string; privacy: string; mode: Mode; unread?: number;
  activity: string; faces?: string[]; desc: string; posts: GroupPost[];
};
export const GROUPS: Record<string, Group> = {
  football: { name: 'Sunday Football', cover: IMG(1058), members: '14 members', privacy: 'Public', mode: 'personal', unread: 3, activity: 'Jonah: Need 2 more for 10am', faces: [A.jonah, A.lea, A.rahul], desc: 'Pickup games every Sunday at Lake Park, field 3. All levels welcome.', posts: [{ a: 'Jonah Park', t: 'Field is booked for 10am. Bring a light and a dark shirt.', time: '1d', img: IMG(1058) }, { a: 'Lea Fischer', t: 'Who has the spare ball pump?', time: '3d' }] },
  family: { name: 'Family', cover: IMG(1011), members: '6 members', privacy: 'Private', mode: 'personal', unread: 5, activity: 'Mom: Dinner at 7, bring dessert', faces: [A.mom, A.dad, A.rahul], desc: 'Private family group. Only members see posts and photos.', posts: [{ a: 'Mom', t: 'Uploaded 23 photos from the lake weekend.', time: '2d', img: IMG(1011) }] },
  plantswap: { name: 'Oakland Plant Swap', cover: IMG(1043), members: '2.3k members', privacy: 'Public', mode: 'personal', unread: 0, activity: '4 monstera cuttings up for trade', faces: [A.nina, A.ines, A.maya], desc: 'Trade cuttings and pots with neighbours. Meetups the first Saturday of every month.', posts: [{ a: 'Nina Alvarez', t: '4 monstera cuttings up for trade. Looking for a pothos.', time: '3h' }] },
  bookclub: { name: 'Tuesday Book Club', cover: IMG(431), members: '11 members', privacy: 'Private', mode: 'personal', unread: 0, activity: 'Next up: Piranesi, chapters 1–8', faces: [A.lea, A.ines, A.maya], desc: "One book a month. We meet at Lea's on the last Tuesday.", posts: [{ a: 'Lea Fischer', t: 'Next up is Piranesi, chapters 1–8. Coffee is on me.', time: '2d', img: IMG(431) }] },
  guild: { name: 'Design Guild', cover: IMG(60), members: '1,248 members', privacy: 'Public', mode: 'work', activity: 'Portfolio review thread is up', desc: 'Open community for product designers. Critiques, gigs and mentorship.', posts: [{ a: 'Daniel Ortiz', t: 'Portfolio review thread is up. Drop a link and review two others.', time: '2h', img: IMG(180) }, { a: 'Priya Nair', t: 'Gig: Northwind needs a contract illustrator for 3 weeks. Message me.', time: '5h' }] },
  nwdesign: { name: 'Northwind Design', cover: IMG(1031), members: '9 members', privacy: 'Verified employees', mode: 'work', activity: 'Crit moved to 3pm', desc: 'Internal group. Only verified Northwind employees can join.', posts: [{ a: 'Aisha Bello', t: 'Crit moved to 3pm today. Same room.', time: 'Tue' }] },
};

/** `f` is 'me', 'them', or a member's first name in group chats. */
export type Msg = { f: string; t: string; at: string; img?: ImageSourcePropType };
export const MSGS: Record<string, Msg[]> = {
  maya: [{ f: 'them', t: 'Are we still doing the Mt. Tam loop?', at: '9:30' }, { f: 'me', t: 'Yes! Trailhead at 8?', at: '9:32' }, { f: 'them', t: '', img: IMG(1018), at: '9:33' }, { f: 'them', t: 'Saturday still on? I can drive.', at: '9:41' }],
  family: [{ f: 'Dad', t: "I'll handle the grill", at: '9:05' }, { f: 'Mom', t: 'Dinner at 7, bring dessert', at: '9:12' }],
  rahul: [{ f: 'them', t: 'You owe me a rematch', at: 'Yesterday' }, { f: 'me', t: 'haha fair', at: 'Yesterday' }],
  football: [{ f: 'Jonah', t: 'Need 2 more for 10am', at: 'Yesterday' }],
  lea: [{ f: 'them', t: 'Look at this haul', at: 'Mon' }, { f: 'them', t: '', img: IMG(1080), at: 'Mon' }],
  priya: [{ f: 'them', t: 'Loved your talk at the meetup.', at: '9:58' }, { f: 'them', t: 'Can you share the case study before Thursday?', at: '10:05' }],
  guild: [{ f: 'Kenji', t: 'Anyone hiring junior researchers?', at: '9:10' }, { f: 'Daniel', t: 'Portfolio review thread is up', at: '9:30' }],
  daniel: [{ f: 'them', t: "Intro'd you to the Lumen team", at: 'Yesterday' }, { f: 'me', t: 'Thanks for the intro!', at: 'Yesterday' }],
  nwdesign: [{ f: 'Aisha', t: 'Crit moved to 3pm', at: 'Tue' }],
  sam: [{ f: 'them', t: "Hi Alex, I'm hiring for a UX research contract at Fieldstone.", at: 'Mon' }, { f: 'them', t: 'Are you open to a quick call this week?', at: 'Mon' }],
};
export const REPLIES = ['Sounds good', 'Perfect, see you then', 'Got it, thanks', 'Will do'];

export type Audience = 'Friends' | 'Colleagues' | 'Public';
export type Post = {
  id: string; mode: Mode | 'both'; aud: Audience; author: string; src?: string; verified?: boolean; meta: string; time: string; text: string;
  img?: ImageSourcePropType | null; imgH?: number; album?: boolean; job?: boolean; jobTitle?: string; jobCo?: string; likes: number; comments: number;
};
export const POSTS: Post[] = [
  { id: 'p1', mode: 'personal', aud: 'Friends', author: 'Maya Chen', meta: 'with Lea Fischer', time: '2h', text: 'Made it to the top before the fog rolled in. Same time next month?', img: IMG(1018), imgH: 340, likes: 48, comments: 12 },
  { id: 'p2', mode: 'personal', aud: 'Friends', author: 'Rahul Mehta', meta: 'added 14 photos to Norway, June', time: '5h', text: 'Still thinking about this trip.', album: true, likes: 31, comments: 4 },
  { id: 'p3', mode: 'personal', aud: 'Public', author: 'Jonah Park', meta: 'in Sunday Football', time: '1d', text: 'Season starts this weekend. Everyone welcome, all levels.', img: IMG(1058), imgH: 220, likes: 22, comments: 9 },
  { id: 'w1', mode: 'work', aud: 'Colleagues', author: 'Priya Nair', verified: true, meta: 'Product Lead at Northwind', time: '1h', text: "We're hiring two product designers for payments. Hybrid in Oakland or remote in the US. Happy to refer people from my network.", job: true, jobTitle: 'Product Designer, Payments', jobCo: 'Northwind · Oakland or remote', likes: 120, comments: 34 },
  { id: 'w2', mode: 'work', aud: 'Public', author: 'Daniel Ortiz', meta: 'Senior Designer at Lumen', time: '4h', text: 'Shipped the new onboarding for Lumen. Activation is up and support tickets are down. Case study in the comments.', img: IMG(180), imgH: 240, likes: 86, comments: 15 },
  { id: 'w3', mode: 'work', aud: 'Colleagues', author: 'Aisha Bello', verified: true, meta: 'Engineering Manager at Northwind', time: '1d', text: 'Spoke at DevDays about growing support engineers into product engineers. I have two mentoring slots open this quarter.', img: IMG(1067), imgH: 220, likes: 64, comments: 7 },
];

export type JobType = 'Full-time' | 'Contract' | 'Gig';
export type Job = { id: string; title: string; co: string; i: string; loc: string; type: JobType; pay: string; ref: string; refSrc?: string; cover: ImageSourcePropType; tags: string[] };
export const JOBS: Job[] = [
  { id: 'j1', title: 'Product Designer, Payments', co: 'Northwind', i: 'NW', loc: 'Oakland · Hybrid', type: 'Full-time', pay: '$140k–$165k', ref: 'Priya Nair can refer you', refSrc: A.priya, cover: IMG(1), tags: ['Fintech', 'Figma', 'Prototyping'] },
  { id: 'j2', title: 'Brand refresh for a café', co: 'Crumb & Co.', i: 'CC', loc: 'Remote', type: 'Gig', pay: '$600 · 1 week', ref: 'Nina Alvarez posted this', refSrc: A.nina, cover: IMG(1060), tags: ['Branding', 'Logo'] },
  { id: 'j3', title: 'UX Researcher', co: 'Fieldstone', i: 'FS', loc: 'Remote · US', type: 'Contract', pay: '$75/hr · 6 months', ref: 'Sam Okafor is hiring', refSrc: A.sam, cover: IMG(3), tags: ['Interviews', 'Mobile'] },
  { id: 'j4', title: 'Design Systems Lead', co: 'Lumen', i: 'LU', loc: 'San Francisco', type: 'Full-time', pay: '$180k–$210k', ref: 'Daniel Ortiz works here', refSrc: A.daniel, cover: IMG(1031), tags: ['Leadership', 'Tokens', 'React'] },
  { id: 'j5', title: 'Onboarding illustrations', co: 'Northwind', i: 'NW', loc: 'Remote', type: 'Gig', pay: '$2,400 · 3 weeks', ref: '', cover: IMG(60), tags: ['Illustration'] },
];

export const MENTORS = [
  { id: 'aisha', name: 'Aisha Bello', topic: 'Engineering management' },
  { id: 'priya', name: 'Priya Nair', topic: 'Product strategy' },
  { id: 'kenji', name: 'Kenji Watanabe', topic: 'Design leadership' },
];

export type NotifKind = 'mentor' | 'action' | 'plain' | 'job';
export type Notif = { id: string; mode: Mode; kind: NotifKind; who: string; text: string; time: string; action?: string; done?: string };
export const NOTIFS: Notif[] = [
  { id: 'n1', mode: 'work', kind: 'mentor', who: 'Tomás Briones', text: 'Tomás Briones asked you for mentorship in interaction design.', time: '12m' },
  { id: 'n2', mode: 'work', kind: 'action', action: 'Endorse back', done: 'Endorsed Aisha for Hiring', who: 'Aisha Bello', text: 'Aisha Bello endorsed you for Prototyping.', time: '1h' },
  { id: 'n3', mode: 'personal', kind: 'plain', who: 'Maya Chen', text: 'Maya Chen tagged you in a post.', time: '2h' },
  { id: 'n4', mode: 'work', kind: 'job', action: 'See role', who: 'Priya Nair', text: 'Priya shared a role that matches your skills: Product Designer, Payments.', time: '3h' },
  { id: 'n5', mode: 'personal', kind: 'action', action: 'Join group', done: 'Joined Sunday Football', who: 'Jonah Park', text: 'Jonah Park invited you to Sunday Football.', time: '1d' },
  { id: 'n6', mode: 'personal', kind: 'plain', who: 'Rahul Mehta', text: 'Rahul Mehta and 12 others liked your photo.', time: '2d' },
];

export type Call = { name: string; kind: 'in' | 'out' | 'missed'; video: boolean; time: string; mode: Mode };
export const CALLS: Call[] = [
  { name: 'Maya Chen', kind: 'in', video: false, time: 'Today, 8:14', mode: 'personal' },
  { name: 'Family', kind: 'missed', video: true, time: 'Yesterday, 19:02', mode: 'personal' },
  { name: 'Rahul Mehta', kind: 'out', video: false, time: 'Sunday, 11:40', mode: 'personal' },
  { name: 'Priya Nair', kind: 'out', video: true, time: 'Today, 9:00', mode: 'work' },
  { name: 'Sam Okafor', kind: 'missed', video: false, time: 'Monday, 14:21', mode: 'work' },
  { name: 'Daniel Ortiz', kind: 'in', video: true, time: 'Friday, 16:05', mode: 'work' },
];

export const PEOPLE = [
  { id: 'jonah', name: 'Jonah Park', meta: '4 mutual friends' },
  { id: 'kenji', name: 'Kenji Watanabe', meta: 'Design Director at Lumen' },
  { id: 'tomas', name: 'Tomás Briones', meta: 'Support Lead at Northwind' },
  { id: 'nina', name: 'Nina Alvarez', meta: 'Founder at Crumb & Co.' },
  { id: 'ines', name: 'Inés Duarte', meta: '6 mutual friends · Oakland' },
  { id: 'aisha', name: 'Aisha Bello', meta: 'Eng Manager at Northwind' },
];

export const SKILLS: [string, number, string][] = [
  ['Interaction design', 42, 'Priya Nair, Daniel Ortiz and 40 others'],
  ['Prototyping', 31, 'Aisha Bello and 30 others'],
  ['Design systems', 27, 'Daniel Ortiz and 26 others'],
  ['User research', 12, 'Sam Okafor and 11 others'],
];

export type LatLng = [number, number];
export const CENTER: LatLng = [37.8027, -122.26];

export type NearPerson = { id: string; name: string; ll: LatLng; status: string; dist: string; chat?: string; tag: string };
export const NEAR: Record<Mode, NearPerson[]> = {
  personal: [
    { id: 'maya', name: 'Maya Chen', ll: [37.8046, -122.258], status: 'Walking around the lake. Anyone up for a loop?', dist: '250 m', chat: 'maya', tag: 'Friend' },
    { id: 'jonah', name: 'Jonah Park', ll: [37.8003, -122.256], status: 'Kicking a ball at Lake Park, need one more', dist: '550 m', tag: '4 mutual friends' },
    { id: 'ines', name: 'Inés Duarte', ll: [37.8063, -122.2633], status: 'Coffee on Grand Ave, happy to have company', dist: '450 m', tag: '6 mutual friends' },
    { id: 'lea', name: 'Lea Fischer', ll: [37.8008, -122.2648], status: 'At the Saturday market until noon', dist: '400 m', chat: 'lea', tag: 'Friend' },
    { id: 'nina', name: 'Nina Alvarez', ll: [37.8077, -122.2572], status: 'Running the plant swap stand', dist: '600 m', tag: '2 mutual friends' },
  ],
  work: [
    { id: 'priya', name: 'Priya Nair', ll: [37.8052, -122.2627], status: 'Working from Blue Bottle until 2pm. Open to quick chats.', dist: '300 m', chat: 'priya', tag: 'Product Lead · Northwind' },
    { id: 'kenji', name: 'Kenji Watanabe', ll: [37.8007, -122.2574], status: 'Open to coffee chats about design leadership', dist: '350 m', tag: 'Design Director · Lumen' },
    { id: 'tomas', name: 'Tomás Briones', ll: [37.8069, -122.2589], status: 'Looking for a mentor in interaction design', dist: '500 m', tag: 'Support Lead · Northwind' },
    { id: 'daniel', name: 'Daniel Ortiz', ll: [37.7996, -122.2641], status: 'Co-working at The Port today', dist: '500 m', chat: 'daniel', tag: 'Senior Designer · Lumen' },
  ],
};

export type Meet = { id: string; title: string; where: string; ll: LatLng; time: string; when: string; going: number; cover: ImageSourcePropType; mine?: boolean };
export const MEETS: Record<Mode, Meet[]> = {
  personal: [
    { id: 'm1', title: 'Pickup football', where: 'Lake Park, field 3', ll: [37.8013, -122.2549], time: '10am', when: 'Today, 10:00', going: 7, cover: IMG(1058) },
    { id: 'm2', title: 'Plant swap', where: 'Grand Ave & Lakeshore', ll: [37.8083, -122.2556], time: '2pm', when: 'Today, 14:00', going: 18, cover: IMG(1043) },
  ],
  work: [
    { id: 'm3', title: "Designers' coffee", where: 'Blue Bottle, Broadway', ll: [37.8058, -122.2652], time: '8:30', when: 'Tomorrow, 8:30', going: 5, cover: IMG(1060) },
    { id: 'm4', title: 'Northwind office hours', where: 'The Port co-working', ll: [37.799, -122.2622], time: '4pm', when: 'Today, 16:00', going: 9, cover: IMG(1) },
  ],
};

export const MEET_FACES: Record<Mode, string[]> = { work: [A.priya, A.kenji, A.daniel], personal: [A.jonah, A.lea, A.maya] };

export const initials = (name: string) => name.slice(0, 2).toUpperCase();
export const firstName = (name: string) => name.split(' ')[0];
export const nowAt = () => {
  const d = new Date();
  return d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
};
