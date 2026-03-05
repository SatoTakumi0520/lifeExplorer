import type { PersonaTemplate, SocialPost } from './types';

export const INITIAL_TEMPLATES: PersonaTemplate[] = [
  {
    id: 1,
    name: 'Steve Jobs',
    title: '禅と創造性',
    color: 'bg-stone-800 text-white',
    routine: [
      {
        time: '05:00',
        title: 'Mirror Question',
        thought: '「もし今日が人生最後の日だとしたら、今日やろうとしていることをやりたいか？」と鏡の前で自問する。',
        type: 'mind',
      },
      {
        time: '06:00',
        title: 'Zen Meditation',
        thought: '禅の瞑想で心を空にする。複雑さを削ぎ落とし、本質だけを残す練習。',
        type: 'mind',
      },
      {
        time: '07:00',
        title: 'Walk & Think',
        thought: '裸足で庭を歩きながら、今日最も重要な一つの決断について考える。',
        type: 'nature',
      },
      {
        time: '09:00',
        title: 'Design Review',
        thought: '製品の細部を徹底的にレビュー。「これは本当に必要か？」を繰り返し問う。',
        type: 'work',
      },
    ],
  },
  {
    id: 2,
    name: 'Haruki M.',
    title: '走る小説家',
    color: 'bg-orange-100 text-orange-800',
    routine: [
      {
        time: '04:00',
        title: 'Early Writing',
        thought: '朝4時に起きて、まだ世界が静かなうちに原稿に向かう。5〜6時間、ただ書く。',
        type: 'work',
      },
      {
        time: '10:00',
        title: 'Running',
        thought: '10kmのランニング。走っている間は何も考えない。身体が勝手に走る状態を目指す。',
        type: 'nature',
      },
      {
        time: '12:00',
        title: 'Music Time',
        thought: 'レコードを聴きながら昼食。音楽は言葉を超えた物語を教えてくれる。',
        type: 'mind',
      },
      {
        time: '21:00',
        title: 'Early Sleep',
        thought: '夜9時には就寝。規則正しい生活こそが長編小説を書き続ける秘訣。',
        type: 'mind',
      },
    ],
  },
  {
    id: 3,
    name: 'Elon Musk',
    title: '5分刻みの超集中',
    color: 'bg-blue-100 text-blue-800',
    routine: [
      {
        time: '06:00',
        title: 'Skip Breakfast',
        thought: '朝食は取らない。時間の節約と集中力の維持のため。コーヒーだけで十分。',
        type: 'work',
      },
      {
        time: '07:00',
        title: 'Email Blitz',
        thought: '30分でメールを処理。重要度で瞬時に判断し、返信は簡潔に。',
        type: 'work',
      },
      {
        time: '08:00',
        title: 'Engineering Deep Dive',
        thought: '最も困難な技術的課題に取り組む。5分単位でスケジュールを区切り、集中を維持。',
        type: 'work',
      },
      {
        time: '22:00',
        title: 'Reading',
        thought: '就寝前の読書。SF小説や物理学の本から未来のアイデアを得る。',
        type: 'mind',
      },
    ],
  },
];

export const SOCIAL_CATEGORIES: Record<string, SocialPost[]> = {
  Business: [
    {
      id: 201,
      user: 'Takeshi M.',
      role: 'CEO',
      title: '経営者の朝5時起床ルーティン',
      likes: 312,
      avatar: '💼',
      routine: [
        { time: '05:00', title: 'News Check', thought: '日経新聞とWSJ...', type: 'work' },
        { time: '06:00', title: 'Strategic Planning', thought: '戦略を練る...', type: 'work' },
      ],
    },
    { id: 202, user: 'Yuki T.', role: 'Consultant', title: '週7MTGを乗り切る集中術', likes: 189, avatar: '📊', routine: [] },
  ],
  Creative: [
    { id: 301, user: 'Sakura N.', role: 'Illustrator', title: 'アイデアが湧く散歩', likes: 428, avatar: '🎨', routine: [] },
  ],
  Wellness: [
    { id: 401, user: 'Mika S.', role: 'Yoga Teacher', title: '心身を整える朝', likes: 521, avatar: '🧘', routine: [] },
  ],
};

export const INITIAL_SOCIAL_FEED: SocialPost[] = [
  {
    id: 101,
    user: 'Anna K.',
    role: 'Yoga Instructor',
    title: '心と体を整える朝の3時間',
    likes: 120,
    avatar: '🧘‍♀️',
    routine: [
      {
        time: '05:30',
        title: 'Sun Salutation',
        thought: '日の出とともに太陽礼拝。身体を目覚めさせ、一日の始まりに感謝を捧げる。',
        type: 'nature',
      },
      {
        time: '06:30',
        title: 'Meditation',
        thought: '呼吸に意識を向け、心を静める。20分間、ただ「今」に存在する。',
        type: 'mind',
      },
      {
        time: '07:30',
        title: 'Healthy Breakfast',
        thought: 'スムージーとオートミール。身体が喜ぶものを丁寧にいただく。',
        type: 'nature',
      },
      {
        time: '08:30',
        title: 'Journaling',
        thought: '感謝していること3つを書き出す。小さな幸せに気づく練習。',
        type: 'mind',
      },
    ],
  },
];
