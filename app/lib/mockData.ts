import type { PersonaTemplate, SocialPost, RoutineTask } from './types';

// ローカル開発用デモルーティン（未ログイン時に表示）
export const MOCK_MY_ROUTINE: RoutineTask[] = [
  { id: 'mock-1', time: '06:00', endTime: '06:30', title: 'Morning Stretch', thought: '目覚めとともに全身を伸ばす。血流を促し、一日を気持ちよくスタート。', type: 'nature' },
  { id: 'mock-2', time: '06:30', endTime: '07:00', title: 'Meditation', thought: '静かに呼吸を整え、今日の意図を設定する。10分でも十分。', type: 'mind' },
  { id: 'mock-3', time: '09:00', endTime: '11:00', title: 'Deep Work', thought: '通知をオフにして最も重要なプロジェクトに集中する。', type: 'work' },
  { id: 'mock-4', time: '12:00', endTime: '12:45', title: 'Lunch Walk', thought: '外に出て歩きながら昼食。太陽を浴びて午後のエネルギーを補充。', type: 'nature' },
  { id: 'mock-5', time: '14:00', endTime: '16:00', title: 'Meetings', thought: 'チームとのコラボレーション。アジェンダを明確にして時間内に終わらせる。', type: 'work' },
  { id: 'mock-6', time: '19:00', endTime: '19:30', title: 'Journaling', thought: '今日の振り返りと明日のTOPタスクを1つ決める。', type: 'mind' },
];

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
  {
    id: 4,
    name: 'Tim Cook',
    title: '4時45分の規律',
    color: 'bg-slate-100 text-slate-800',
    routine: [
      {
        time: '04:45',
        endTime: '05:15',
        title: 'User Mail',
        thought: '世界中のAppleユーザーからのメールを読む。現場の声が最高の羅針盤。',
        type: 'mind',
      },
      {
        time: '05:15',
        endTime: '06:00',
        title: 'Gym',
        thought: 'ジムで体を鍛える。規律ある身体が規律ある思考を生む。',
        type: 'nature',
      },
      {
        time: '08:00',
        endTime: '12:00',
        title: 'Back-to-Back Meetings',
        thought: '各チームとの連続ミーティング。明確な意思決定を積み重ねる。',
        type: 'work',
      },
      {
        time: '21:00',
        endTime: '21:30',
        title: 'Wind Down',
        thought: '翌日の優先事項を確認し、静かに一日を締めくくる。',
        type: 'mind',
      },
    ],
  },
  {
    id: 5,
    name: 'Oprah',
    title: '感謝と内省',
    color: 'bg-purple-100 text-purple-800',
    routine: [
      {
        time: '06:00',
        endTime: '06:20',
        title: 'Meditation',
        thought: '朝の瞑想で内なる静寂を見つける。感謝の気持ちで心を満たす。',
        type: 'mind',
      },
      {
        time: '06:20',
        endTime: '07:00',
        title: 'Gratitude Journal',
        thought: '今日感謝できることを5つ書く。小さな喜びを見逃さない練習。',
        type: 'mind',
      },
      {
        time: '07:00',
        endTime: '08:00',
        title: 'Morning Walk',
        thought: '自然の中を歩く。木々や光に意識を向け、身体と心を一致させる。',
        type: 'nature',
      },
      {
        time: '09:00',
        endTime: '11:00',
        title: 'Creative Work',
        thought: '最もエネルギーがある時間帯に創造的な仕事を集中させる。',
        type: 'work',
      },
    ],
  },
  {
    id: 6,
    name: 'Naval',
    title: '思考と読書の技法',
    color: 'bg-teal-100 text-teal-800',
    routine: [
      {
        time: '07:00',
        endTime: '07:30',
        title: 'No Phone Morning',
        thought: '起床後1時間はスマートフォンを触らない。自分の思考を外部に汚染させない。',
        type: 'mind',
      },
      {
        time: '07:30',
        endTime: '09:00',
        title: 'Long-form Reading',
        thought: '本を1〜2時間読む。ツイートではなく書籍から知識を得る。',
        type: 'mind',
      },
      {
        time: '09:00',
        endTime: '10:00',
        title: 'Exercise',
        thought: '運動は投資。身体の健康なくして精神の鋭さはない。',
        type: 'nature',
      },
      {
        time: '10:00',
        endTime: '13:00',
        title: 'Deep Thinking',
        thought: 'カレンダーを空白にして深く考える時間を守る。忙しさは怠惰の一形態。',
        type: 'work',
      },
    ],
  },
  {
    id: 7,
    name: 'Yoshida S.',
    title: '茶道に学ぶ余白',
    color: 'bg-amber-100 text-amber-800',
    routine: [
      {
        time: '05:30',
        endTime: '06:00',
        title: 'Tea Ceremony',
        thought: '朝のお茶を丁寧に点てる。所作に集中することで、一日の雑念を払う。',
        type: 'mind',
      },
      {
        time: '06:00',
        endTime: '06:45',
        title: '散歩と観察',
        thought: '近所を歩きながら季節の変化を観察する。見慣れた道に新しい発見を探す。',
        type: 'nature',
      },
      {
        time: '09:00',
        endTime: '12:00',
        title: '集中作業',
        thought: '午前中は外部からの連絡を断ち、最も重要な一つの仕事だけに向き合う。',
        type: 'work',
      },
      {
        time: '20:00',
        endTime: '21:00',
        title: '読書と余白',
        thought: '就寝前は読書か何もしない時間。余白こそが翌日のアイデアを育てる。',
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
