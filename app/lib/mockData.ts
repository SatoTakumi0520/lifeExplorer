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

// ─── Persona Templates ──────────────────────────────────────────────

export const INITIAL_TEMPLATES: PersonaTemplate[] = [
  // ── Business ──
  {
    id: 1,
    name: 'Steve Jobs',
    title: '禅と創造性',
    color: 'bg-stone-800 text-white',
    category: 'business',
    routine: [
      { time: '05:00', title: 'Mirror Question', thought: '「もし今日が人生最後の日だとしたら、今日やろうとしていることをやりたいか？」と鏡の前で自問する。', type: 'mind' },
      { time: '06:00', title: 'Zen Meditation', thought: '禅の瞑想で心を空にする。複雑さを削ぎ落とし、本質だけを残す練習。', type: 'mind' },
      { time: '07:00', title: 'Walk & Think', thought: '裸足で庭を歩きながら、今日最も重要な一つの決断について考える。', type: 'nature' },
      { time: '09:00', title: 'Design Review', thought: '製品の細部を徹底的にレビュー。「これは本当に必要か？」を繰り返し問う。', type: 'work' },
    ],
  },
  {
    id: 3,
    name: 'Elon Musk',
    title: '5分刻みの超集中',
    color: 'bg-blue-100 text-blue-800',
    category: 'business',
    routine: [
      { time: '06:00', title: 'Skip Breakfast', thought: '朝食は取らない。時間の節約と集中力の維持のため。コーヒーだけで十分。', type: 'work' },
      { time: '07:00', title: 'Email Blitz', thought: '30分でメールを処理。重要度で瞬時に判断し、返信は簡潔に。', type: 'work' },
      { time: '08:00', title: 'Engineering Deep Dive', thought: '最も困難な技術的課題に取り組む。5分単位でスケジュールを区切り、集中を維持。', type: 'work' },
      { time: '22:00', title: 'Reading', thought: '就寝前の読書。SF小説や物理学の本から未来のアイデアを得る。', type: 'mind' },
    ],
  },
  {
    id: 4,
    name: 'Tim Cook',
    title: '4時45分の規律',
    color: 'bg-slate-100 text-slate-800',
    category: 'business',
    routine: [
      { time: '04:45', endTime: '05:15', title: 'User Mail', thought: '世界中のAppleユーザーからのメールを読む。現場の声が最高の羅針盤。', type: 'mind' },
      { time: '05:15', endTime: '06:00', title: 'Gym', thought: 'ジムで体を鍛える。規律ある身体が規律ある思考を生む。', type: 'nature' },
      { time: '08:00', endTime: '12:00', title: 'Back-to-Back Meetings', thought: '各チームとの連続ミーティング。明確な意思決定を積み重ねる。', type: 'work' },
      { time: '21:00', endTime: '21:30', title: 'Wind Down', thought: '翌日の優先事項を確認し、静かに一日を締めくくる。', type: 'mind' },
    ],
  },
  {
    id: 8,
    name: 'Startup Founder',
    title: 'ゼロからの構築',
    color: 'bg-rose-100 text-rose-800',
    category: 'business',
    routine: [
      { time: '06:30', endTime: '07:00', title: 'Metrics Check', thought: 'KPIダッシュボードを確認。数字は嘘をつかない。最初に現実を見る。', type: 'work' },
      { time: '07:00', endTime: '07:30', title: 'User Interviews', thought: '毎朝1人のユーザーと話す。机上の空論ではなく、現場の声で方向を決める。', type: 'work' },
      { time: '09:00', endTime: '12:00', title: 'Builder Time', thought: 'Slackを閉じて3時間、プロダクトの最重要課題だけに集中する。', type: 'work' },
      { time: '20:00', endTime: '20:30', title: 'Reflection', thought: '今日学んだことを1つだけ書き出す。毎日1%の成長が複利になる。', type: 'mind' },
    ],
  },
  {
    id: 9,
    name: 'Remote Worker',
    title: 'どこでも集中する術',
    color: 'bg-sky-100 text-sky-800',
    category: 'business',
    routine: [
      { time: '07:00', endTime: '07:20', title: 'Morning Pages', thought: '起きてすぐ、頭の中のモヤモヤを3ページ書き出す。思考の交通整理。', type: 'mind' },
      { time: '08:00', endTime: '08:15', title: 'Environment Setup', thought: 'デスクを整え、BGMを選び、水を用意する。環境が集中を作る。', type: 'work' },
      { time: '09:00', endTime: '12:00', title: 'Deep Work Block', thought: '午前中はミーティングを入れない。最も頭が冴える時間を自分のために使う。', type: 'work' },
      { time: '17:00', endTime: '17:30', title: 'Shutdown Ritual', thought: 'タスクを閉じ、明日の最優先事項を1つ決めてPCを閉じる。オンオフの切り替えが命。', type: 'mind' },
    ],
  },

  // ── Creative ──
  {
    id: 2,
    name: 'Haruki M.',
    title: '走る小説家',
    color: 'bg-orange-100 text-orange-800',
    category: 'creative',
    routine: [
      { time: '04:00', title: 'Early Writing', thought: '朝4時に起きて、まだ世界が静かなうちに原稿に向かう。5〜6時間、ただ書く。', type: 'work' },
      { time: '10:00', title: 'Running', thought: '10kmのランニング。走っている間は何も考えない。身体が勝手に走る状態を目指す。', type: 'nature' },
      { time: '12:00', title: 'Music Time', thought: 'レコードを聴きながら昼食。音楽は言葉を超えた物語を教えてくれる。', type: 'mind' },
      { time: '21:00', title: 'Early Sleep', thought: '夜9時には就寝。規則正しい生活こそが長編小説を書き続ける秘訣。', type: 'mind' },
    ],
  },
  {
    id: 10,
    name: 'Photographer',
    title: '光を読む一日',
    color: 'bg-zinc-100 text-zinc-800',
    category: 'creative',
    routine: [
      { time: '05:00', endTime: '06:30', title: 'Golden Hour', thought: '日の出前に撮影ポイントに到着。光が最も美しい時間は二度と来ない。', type: 'work' },
      { time: '09:00', endTime: '11:00', title: 'Editing & Selection', thought: '撮った写真を厳選。100枚から1枚を選ぶ目を養う。', type: 'work' },
      { time: '14:00', endTime: '15:00', title: 'Photo Walk', thought: '街を歩き、何気ない日常の中に物語を探す。見慣れた景色を新しい目で。', type: 'nature' },
      { time: '20:00', endTime: '21:00', title: 'Study Masters', thought: '写真集を開き、巨匠たちの構図と光を学ぶ。インプットなくしてアウトプットなし。', type: 'mind' },
    ],
  },
  {
    id: 11,
    name: 'Music Producer',
    title: '音と静寂のリズム',
    color: 'bg-fuchsia-100 text-fuchsia-800',
    category: 'creative',
    routine: [
      { time: '07:00', endTime: '07:30', title: 'Sound Walk', thought: '朝の散歩で耳を澄ます。鳥の声、風の音、街のリズムがインスピレーション。', type: 'nature' },
      { time: '10:00', endTime: '13:00', title: 'Studio Session', thought: '午前中は新しいビートやメロディを作る。批判せず、ただ出し続ける。', type: 'work' },
      { time: '15:00', endTime: '17:00', title: 'Mix & Refine', thought: '午後は昨日の作品を客観的に聴き直し、磨き上げる。', type: 'work' },
      { time: '21:00', endTime: '22:00', title: 'Listen Deeply', thought: 'ジャンルを問わず音楽を聴く。自分の守備範囲の外にヒントがある。', type: 'mind' },
    ],
  },
  {
    id: 12,
    name: 'Chef',
    title: '五感で味わう暮らし',
    color: 'bg-red-100 text-red-800',
    category: 'creative',
    routine: [
      { time: '05:30', endTime: '06:30', title: 'Market Visit', thought: '早朝の市場で旬の食材を選ぶ。手に取り、香りを嗅ぎ、対話する。', type: 'nature' },
      { time: '08:00', endTime: '10:00', title: 'Mise en Place', thought: '下準備を丁寧に。整った環境が心の余裕を生み、料理の質を上げる。', type: 'work' },
      { time: '12:00', endTime: '14:00', title: 'Creative Cooking', thought: '昼のピークタイムは即興の連続。五感をフル活用して一皿を仕上げる。', type: 'work' },
      { time: '21:00', endTime: '21:30', title: 'Recipe Journal', thought: '今日の発見をノートに記録。失敗も成功も、次の一皿への糧にする。', type: 'mind' },
    ],
  },

  // ── Wellness ──
  {
    id: 5,
    name: 'Oprah',
    title: '感謝と内省',
    color: 'bg-purple-100 text-purple-800',
    category: 'wellness',
    routine: [
      { time: '06:00', endTime: '06:20', title: 'Meditation', thought: '朝の瞑想で内なる静寂を見つける。感謝の気持ちで心を満たす。', type: 'mind' },
      { time: '06:20', endTime: '07:00', title: 'Gratitude Journal', thought: '今日感謝できることを5つ書く。小さな喜びを見逃さない練習。', type: 'mind' },
      { time: '07:00', endTime: '08:00', title: 'Morning Walk', thought: '自然の中を歩く。木々や光に意識を向け、身体と心を一致させる。', type: 'nature' },
      { time: '09:00', endTime: '11:00', title: 'Creative Work', thought: '最もエネルギーがある時間帯に創造的な仕事を集中させる。', type: 'work' },
    ],
  },
  {
    id: 13,
    name: 'Yoga Teacher',
    title: '呼吸とともに生きる',
    color: 'bg-emerald-100 text-emerald-800',
    category: 'wellness',
    routine: [
      { time: '05:30', endTime: '06:30', title: 'Sun Salutation', thought: '太陽礼拝で身体を目覚めさせる。呼吸と動きを一つに。', type: 'nature' },
      { time: '06:30', endTime: '07:00', title: 'Pranayama', thought: '呼吸法で心身のエネルギーを整える。吸う息で活力を、吐く息で不安を手放す。', type: 'mind' },
      { time: '10:00', endTime: '12:00', title: 'Teaching', thought: '生徒一人一人の身体に寄り添い、無理なく導く。教えることは学ぶこと。', type: 'work' },
      { time: '19:00', endTime: '19:30', title: 'Yin Yoga', thought: '夜は陰ヨガで深くリラックス。今日の身体に感謝して、手放す練習。', type: 'nature' },
    ],
  },
  {
    id: 14,
    name: 'Marathon Runner',
    title: '限界の先にある景色',
    color: 'bg-lime-100 text-lime-800',
    category: 'wellness',
    routine: [
      { time: '05:00', endTime: '05:15', title: 'Body Check', thought: '起きたら心拍数と筋肉の状態を確認。身体の声を聴くことが怪我を防ぐ。', type: 'mind' },
      { time: '05:30', endTime: '07:00', title: 'Long Run', thought: '朝の涼しい時間に走る。最初の20分を我慢すれば、身体が走り方を思い出す。', type: 'nature' },
      { time: '07:30', endTime: '08:00', title: 'Recovery Meal', thought: 'タンパク質と炭水化物を30分以内に。回復こそがトレーニングの本体。', type: 'nature' },
      { time: '21:00', endTime: '21:30', title: 'Training Log', thought: '距離、心拍、感覚を記録。データと直感の両方を信じる。', type: 'mind' },
    ],
  },
  {
    id: 15,
    name: 'Mindfulness Coach',
    title: '「今ここ」に帰る',
    color: 'bg-cyan-100 text-cyan-800',
    category: 'wellness',
    routine: [
      { time: '06:00', endTime: '06:45', title: 'Sitting Meditation', thought: '45分間、ただ座る。呼吸を数え、思考が流れるのを見守る。', type: 'mind' },
      { time: '07:00', endTime: '07:30', title: 'Mindful Breakfast', thought: '食事に全注意を向ける。一口ごとの味、温度、食感を味わい尽くす。', type: 'nature' },
      { time: '12:00', endTime: '12:15', title: 'Body Scan', thought: '昼休みに全身をスキャン。緊張している場所に気づき、意識的に力を抜く。', type: 'mind' },
      { time: '21:00', endTime: '21:20', title: 'Loving-Kindness', thought: '慈悲の瞑想で一日を終える。自分、大切な人、すべての人に優しさを送る。', type: 'mind' },
    ],
  },

  // ── Morning ──
  {
    id: 16,
    name: 'Robin Sharma',
    title: '5AM Club',
    color: 'bg-yellow-100 text-yellow-800',
    category: 'morning',
    routine: [
      { time: '05:00', endTime: '05:20', title: 'Move', thought: '起きたら即運動。20分の激しい運動で脳にBDNFを送り込む。', type: 'nature' },
      { time: '05:20', endTime: '05:40', title: 'Reflect', thought: '瞑想とジャーナリング。内面を整理し、今日のビジョンを明確にする。', type: 'mind' },
      { time: '05:40', endTime: '06:00', title: 'Grow', thought: '読書や学習。世界のトップ5%は皆、朝に自己投資している。', type: 'mind' },
      { time: '06:00', endTime: '08:00', title: 'World-Class Work', thought: '誰にも邪魔されない2時間。この「天才の時間」が人生を変える。', type: 'work' },
    ],
  },
  {
    id: 17,
    name: 'Night Owl → Early Bird',
    title: '朝型シフト挑戦記',
    color: 'bg-indigo-100 text-indigo-800',
    category: 'morning',
    routine: [
      { time: '06:30', endTime: '06:45', title: 'Light Therapy', thought: '起きたらすぐ明るい光を浴びる。体内時計をリセットする最も効果的な方法。', type: 'nature' },
      { time: '06:45', endTime: '07:00', title: 'Cold Shower', thought: '冷水シャワーで交感神経をオン。不快感を乗り越える小さな勝利が一日を変える。', type: 'nature' },
      { time: '07:00', endTime: '08:00', title: 'Most Important Task', thought: '一番やりたくないタスクを最初に。朝の意志力が最も強い時間に片づける。', type: 'work' },
      { time: '22:00', endTime: '22:15', title: 'Wind Down', thought: 'ブルーライトを遮断し、明日の朝を楽にする準備。夜を制する者が朝を制す。', type: 'mind' },
    ],
  },

  // ── Minimalist ──
  {
    id: 6,
    name: 'Naval',
    title: '思考と読書の技法',
    color: 'bg-teal-100 text-teal-800',
    category: 'minimalist',
    routine: [
      { time: '07:00', endTime: '07:30', title: 'No Phone Morning', thought: '起床後1時間はスマートフォンを触らない。自分の思考を外部に汚染させない。', type: 'mind' },
      { time: '07:30', endTime: '09:00', title: 'Long-form Reading', thought: '本を1〜2時間読む。ツイートではなく書籍から知識を得る。', type: 'mind' },
      { time: '09:00', endTime: '10:00', title: 'Exercise', thought: '運動は投資。身体の健康なくして精神の鋭さはない。', type: 'nature' },
      { time: '10:00', endTime: '13:00', title: 'Deep Thinking', thought: 'カレンダーを空白にして深く考える時間を守る。忙しさは怠惰の一形態。', type: 'work' },
    ],
  },
  {
    id: 7,
    name: 'Yoshida S.',
    title: '茶道に学ぶ余白',
    color: 'bg-amber-100 text-amber-800',
    category: 'minimalist',
    routine: [
      { time: '05:30', endTime: '06:00', title: 'Tea Ceremony', thought: '朝のお茶を丁寧に点てる。所作に集中することで、一日の雑念を払う。', type: 'mind' },
      { time: '06:00', endTime: '06:45', title: '散歩と観察', thought: '近所を歩きながら季節の変化を観察する。見慣れた道に新しい発見を探す。', type: 'nature' },
      { time: '09:00', endTime: '12:00', title: '集中作業', thought: '午前中は外部からの連絡を断ち、最も重要な一つの仕事だけに向き合う。', type: 'work' },
      { time: '20:00', endTime: '21:00', title: '読書と余白', thought: '就寝前は読書か何もしない時間。余白こそが翌日のアイデアを育てる。', type: 'mind' },
    ],
  },
  {
    id: 18,
    name: 'Digital Nomad',
    title: '場所を選ばない自由',
    color: 'bg-orange-50 text-orange-700',
    category: 'minimalist',
    routine: [
      { time: '07:00', endTime: '07:30', title: 'Morning Walk', thought: '新しい街でも朝の散歩は欠かさない。知らない路地に迷い込むのが楽しみ。', type: 'nature' },
      { time: '08:00', endTime: '08:15', title: 'Cafe Scouting', thought: 'Wi-Fiと電源がある良いカフェを見つける。環境が変われば発想も変わる。', type: 'work' },
      { time: '09:00', endTime: '13:00', title: 'Focus Work', thought: '午前中に集中して稼ぐ。午後は自分の時間。これがノマドの鉄則。', type: 'work' },
      { time: '16:00', endTime: '17:00', title: 'Explore', thought: '地元の市場や美術館を巡る。旅と仕事の境界線を溶かすのがこの生き方。', type: 'nature' },
    ],
  },
  {
    id: 19,
    name: 'Essentialist',
    title: 'より少なく、より良く',
    color: 'bg-stone-100 text-stone-700',
    category: 'minimalist',
    routine: [
      { time: '06:00', endTime: '06:30', title: 'Silence', thought: '起きたら30分間、何もしない。静寂の中で今日本当にやるべきことを見極める。', type: 'mind' },
      { time: '07:00', endTime: '07:15', title: 'One Thing', thought: '今日のたった1つの最重要タスクを決める。それ以外は全て「いい」こと止まり。', type: 'mind' },
      { time: '09:00', endTime: '12:00', title: 'Essential Work', thought: 'その1つに全力を注ぐ。多くのことを中途半端にやるより、1つを完璧に。', type: 'work' },
      { time: '18:00', endTime: '19:00', title: 'Unplug', thought: 'デバイスをすべてオフに。家族との時間、自然との時間に全身で向き合う。', type: 'nature' },
    ],
  },

  // ── Student ──
  {
    id: 20,
    name: 'Medical Student',
    title: '知識の海を泳ぐ',
    color: 'bg-blue-50 text-blue-700',
    category: 'student',
    routine: [
      { time: '06:00', endTime: '06:30', title: 'Active Recall', thought: '昨日の講義内容をノートを見ずに思い出す。記憶は「引き出す」ことで定着する。', type: 'mind' },
      { time: '07:00', endTime: '12:00', title: 'Lecture & Lab', thought: '授業中は理解に集中し、疑問点をリアルタイムで書き留める。', type: 'work' },
      { time: '14:00', endTime: '17:00', title: 'Study Group', thought: '仲間に教えることで自分の理解が深まる。教える準備が最高の復習。', type: 'work' },
      { time: '21:00', endTime: '21:30', title: 'Spaced Review', thought: '間隔反復で重要事項を復習。忘却曲線に逆らうのではなく、利用する。', type: 'mind' },
    ],
  },
  {
    id: 21,
    name: 'Researcher',
    title: '問いを磨く日々',
    color: 'bg-violet-100 text-violet-800',
    category: 'student',
    routine: [
      { time: '06:30', endTime: '07:00', title: 'Paper Reading', thought: '朝一番に最新の論文を1本精読。コーヒーと共に知識のフロンティアを確認。', type: 'mind' },
      { time: '09:00', endTime: '12:00', title: 'Research Time', thought: '午前中はデータ分析と執筆に集中。誰にも邪魔されない時間が研究の質を決める。', type: 'work' },
      { time: '14:00', endTime: '15:00', title: 'Lab Meeting', thought: 'チームで進捗を共有し、互いの盲点を指摘し合う。科学は一人ではできない。', type: 'work' },
      { time: '19:00', endTime: '19:30', title: 'Research Journal', thought: '今日の発見と疑問を書き出す。答えより、良い問いを持つことが大切。', type: 'mind' },
    ],
  },
  {
    id: 22,
    name: 'Student Athlete',
    title: '文武両道の設計図',
    color: 'bg-green-100 text-green-800',
    category: 'student',
    routine: [
      { time: '05:30', endTime: '07:00', title: 'Morning Practice', thought: '早朝トレーニング。まだ誰もいないグラウンドで、昨日の自分を超える。', type: 'nature' },
      { time: '08:00', endTime: '12:00', title: 'Classes', thought: '授業は100%集中。限られた時間だからこそ、一回で吸収する。', type: 'work' },
      { time: '15:00', endTime: '17:00', title: 'Team Practice', thought: 'チーム練習は全力で。仲間と切磋琢磨する時間が成長を加速させる。', type: 'nature' },
      { time: '20:00', endTime: '21:00', title: 'Study Block', thought: 'テスト前だけでなく毎日1時間。積み重ねが焦りを消す。', type: 'mind' },
    ],
  },

  // ── More Business ──
  {
    id: 23,
    name: 'Freelance Designer',
    title: '自分だけの時間割',
    color: 'bg-pink-100 text-pink-800',
    category: 'creative',
    routine: [
      { time: '08:00', endTime: '08:30', title: 'Inspiration Surf', thought: 'Dribbble、Behanceを眺めてインスピレーションを充填。目を肥やす時間。', type: 'mind' },
      { time: '09:00', endTime: '12:00', title: 'Client Work', thought: '午前中はクライアントワーク。納期のあるものを集中力が高い時間に。', type: 'work' },
      { time: '14:00', endTime: '16:00', title: 'Personal Project', thought: '午後は自分のプロジェクト。受注仕事だけでは表現が枯れてしまう。', type: 'work' },
      { time: '17:00', endTime: '17:30', title: 'Skill Practice', thought: '新しいツールや技法を30分だけ試す。小さな実験の積み重ねがスキルを広げる。', type: 'mind' },
    ],
  },
  {
    id: 24,
    name: 'Working Parent',
    title: '家族と夢の両立',
    color: 'bg-warm-100 text-amber-700',
    category: 'morning',
    routine: [
      { time: '05:00', endTime: '06:00', title: 'My Hour', thought: '家族が起きる前の1時間が自分への投資時間。読書、運動、何でもいい。', type: 'mind' },
      { time: '06:00', endTime: '07:30', title: 'Family Morning', thought: '朝食を一緒に。何気ない会話が子どもの記憶に残る。', type: 'nature' },
      { time: '09:00', endTime: '15:00', title: 'Focused Work', thought: 'お迎えまでの時間を最大効率で。完璧主義を捨て、80%で次へ進む。', type: 'work' },
      { time: '20:30', endTime: '21:00', title: 'Gratitude', thought: '寝かしつけの後、今日の小さな幸せを振り返る。忙しい日ほど感謝が大事。', type: 'mind' },
    ],
  },
  {
    id: 25,
    name: 'Retiree Gardener',
    title: '土と季節に寄り添う',
    color: 'bg-green-50 text-green-700',
    category: 'wellness',
    routine: [
      { time: '06:00', endTime: '06:30', title: 'Garden Observation', thought: '朝露の中、庭を見回る。昨日なかった芽を見つけた時の喜びは格別。', type: 'nature' },
      { time: '07:00', endTime: '09:00', title: 'Gardening', thought: '土に触れ、水をやり、剪定する。植物の成長は焦っても早まらないことを教えてくれる。', type: 'nature' },
      { time: '10:00', endTime: '11:00', title: 'Reading', thought: '縁側で本を読む。急ぐ必要のない読書ほど贅沢なものはない。', type: 'mind' },
      { time: '15:00', endTime: '16:00', title: 'Neighborhood Walk', thought: '近所を散歩して顔見知りと立ち話。人とのつながりが健康の土台。', type: 'nature' },
    ],
  },
];

// ─── Persona categories for Explore screen ──────────────────────────

export const PERSONA_CATEGORY_LABELS: Record<string, string> = {
  all: 'すべて',
  morning: '朝活',
  wellness: '心身の健康',
  business: 'ビジネス',
  creative: 'クリエイティブ',
  minimalist: 'ミニマリスト',
  student: '学び',
  custom: '見つけた日常',
};

// ─── Legacy Social data (Phase 2で使用) ─────────────────────────────

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
      { time: '05:30', title: 'Sun Salutation', thought: '日の出とともに太陽礼拝。身体を目覚めさせ、一日の始まりに感謝を捧げる。', type: 'nature' },
      { time: '06:30', title: 'Meditation', thought: '呼吸に意識を向け、心を静める。20分間、ただ「今」に存在する。', type: 'mind' },
      { time: '07:30', title: 'Healthy Breakfast', thought: 'スムージーとオートミール。身体が喜ぶものを丁寧にいただく。', type: 'nature' },
      { time: '08:30', title: 'Journaling', thought: '感謝していること3つを書き出す。小さな幸せに気づく練習。', type: 'mind' },
    ],
  },
];
