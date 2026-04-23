import type { PersonaTemplate, SocialPost, RoutineTask } from './types';

// ローカル開発用デモルーティン — 平日
export const MOCK_MY_ROUTINE_WEEKDAY: RoutineTask[] = [
  { id: 'mock-w1', time: '06:00', endTime: '06:30', title: '朝のストレッチ', thought: '目覚めとともに全身を伸ばす。血流を促し、一日を気持ちよくスタート。', type: 'nature' },
  { id: 'mock-w2', time: '06:30', endTime: '07:00', title: '瞑想', thought: '静かに呼吸を整え、今日の意図を設定する。10分でも十分。', type: 'mind' },
  { id: 'mock-w3', time: '09:00', endTime: '11:00', title: '集中作業', thought: '通知をオフにして最も重要なプロジェクトに集中する。', type: 'work' },
  { id: 'mock-w4', time: '12:00', endTime: '12:45', title: '昼の散歩', thought: '外に出て歩きながら昼食。太陽を浴びて午後のエネルギーを補充。', type: 'nature' },
  { id: 'mock-w5', time: '14:00', endTime: '16:00', title: 'ミーティング', thought: 'チームとのコラボレーション。アジェンダを明確にして時間内に終わらせる。', type: 'work' },
  { id: 'mock-w6', time: '19:00', endTime: '19:30', title: '振り返りノート', thought: '今日の振り返りと明日のTOPタスクを1つ決める。', type: 'mind' },
];

// ローカル開発用デモルーティン — 休日
export const MOCK_MY_ROUTINE_WEEKEND: RoutineTask[] = [
  { id: 'mock-e1', time: '08:00', endTime: '08:30', title: 'ゆっくり朝食', thought: 'コーヒーを淹れて、好きなパンをゆっくり食べる。', type: 'nature' },
  { id: 'mock-e2', time: '09:00', endTime: '10:00', title: '読書タイム', thought: '積読になっていた本を読む。静かな朝は最高の読書タイム。', type: 'mind' },
  { id: 'mock-e3', time: '10:30', endTime: '12:00', title: 'トレーニング', thought: 'ジムでトレーニング。平日の疲れをリフレッシュ。', type: 'nature' },
  { id: 'mock-e4', time: '14:00', endTime: '15:30', title: '趣味の時間', thought: '趣味のプロジェクトや新しいスキルの練習。', type: 'mind' },
  { id: 'mock-e5', time: '18:00', endTime: '19:00', title: '夕方の散歩', thought: '近所を散歩して一週間を振り返る。', type: 'nature' },
];

// 後方互換: 古いコードが参照する場合
export const MOCK_MY_ROUTINE = MOCK_MY_ROUTINE_WEEKDAY;

// ─── Persona Templates ──────────────────────────────────────────────

export const INITIAL_TEMPLATES: PersonaTemplate[] = [
  // ── Business ──
  {
    id: 1,
    name: '禅の思想家',
    title: '禅と創造性',
    color: 'bg-stone-800 text-white',
    category: 'business',
    routine: [
      { time: '05:00', title: '鏡への問い', thought: '「もし今日が人生最後の日だとしたら、今日やろうとしていることをやりたいか？」と鏡の前で自問する。', type: 'mind' },
      { time: '06:00', title: '禅の瞑想', thought: '禅の瞑想で心を空にする。複雑さを削ぎ落とし、本質だけを残す練習。', type: 'mind' },
      { time: '07:00', title: '散歩と思索', thought: '裸足で庭を歩きながら、今日最も重要な一つの決断について考える。', type: 'nature' },
      { time: '09:00', title: 'デザインレビュー', thought: '製品の細部を徹底的にレビュー。「これは本当に必要か？」を繰り返し問う。', type: 'work' },
    ],
  },
  {
    id: 3,
    name: '超集中スケジューラー',
    title: '5分刻みの超集中',
    color: 'bg-blue-100 text-blue-800',
    category: 'business',
    routine: [
      { time: '06:00', title: '朝食スキップ', thought: '朝食は取らない。時間の節約と集中力の維持のため。コーヒーだけで十分。', type: 'work' },
      { time: '07:00', title: 'メール一括処理', thought: '30分でメールを処理。重要度で瞬時に判断し、返信は簡潔に。', type: 'work' },
      { time: '08:00', title: '技術的深掘り', thought: '最も困難な技術的課題に取り組む。5分単位でスケジュールを区切り、集中を維持。', type: 'work' },
      { time: '22:00', title: '就寝前の読書', thought: '就寝前の読書。SF小説や物理学の本から未来のアイデアを得る。', type: 'mind' },
    ],
  },
  {
    id: 4,
    name: '規律のリーダー',
    title: '4時45分の規律',
    color: 'bg-slate-100 text-slate-800',
    category: 'business',
    routine: [
      { time: '04:45', endTime: '05:15', title: 'ユーザーメール確認', thought: '世界中のAppleユーザーからのメールを読む。現場の声が最高の羅針盤。', type: 'mind' },
      { time: '05:15', endTime: '06:00', title: 'ジムトレーニング', thought: 'ジムで体を鍛える。規律ある身体が規律ある思考を生む。', type: 'nature' },
      { time: '08:00', endTime: '12:00', title: '連続ミーティング', thought: '各チームとの連続ミーティング。明確な意思決定を積み重ねる。', type: 'work' },
      { time: '21:00', endTime: '21:30', title: '就寝準備', thought: '翌日の優先事項を確認し、静かに一日を締めくくる。', type: 'mind' },
    ],
  },
  {
    id: 8,
    name: 'スタートアップ創業者',
    title: 'ゼロからの構築',
    color: 'bg-rose-100 text-rose-800',
    category: 'business',
    routine: [
      { time: '06:30', endTime: '07:00', title: '指標チェック', thought: 'KPIダッシュボードを確認。数字は嘘をつかない。最初に現実を見る。', type: 'work' },
      { time: '07:00', endTime: '07:30', title: 'ユーザーインタビュー', thought: '毎朝1人のユーザーと話す。机上の空論ではなく、現場の声で方向を決める。', type: 'work' },
      { time: '09:00', endTime: '12:00', title: '開発集中タイム', thought: 'Slackを閉じて3時間、プロダクトの最重要課題だけに集中する。', type: 'work' },
      { time: '20:00', endTime: '20:30', title: '一日の振り返り', thought: '今日学んだことを1つだけ書き出す。毎日1%の成長が複利になる。', type: 'mind' },
    ],
  },
  {
    id: 9,
    name: 'リモートワーカー',
    title: 'どこでも集中する術',
    color: 'bg-sky-100 text-sky-800',
    category: 'business',
    routine: [
      { time: '07:00', endTime: '07:20', title: 'モーニングページ', thought: '起きてすぐ、頭の中のモヤモヤを3ページ書き出す。思考の交通整理。', type: 'mind' },
      { time: '08:00', endTime: '08:15', title: '作業環境の準備', thought: 'デスクを整え、BGMを選び、水を用意する。環境が集中を作る。', type: 'work' },
      { time: '09:00', endTime: '12:00', title: '集中作業ブロック', thought: '午前中はミーティングを入れない。最も頭が冴える時間を自分のために使う。', type: 'work' },
      { time: '17:00', endTime: '17:30', title: '終業の儀式', thought: 'タスクを閉じ、明日の最優先事項を1つ決めてPCを閉じる。オンオフの切り替えが命。', type: 'mind' },
    ],
  },

  // ── Creative ──
  {
    id: 2,
    name: '走る小説家',
    title: '走る小説家',
    color: 'bg-orange-100 text-orange-800',
    category: 'creative',
    routine: [
      { time: '04:00', title: '早朝の執筆', thought: '朝4時に起きて、まだ世界が静かなうちに原稿に向かう。5〜6時間、ただ書く。', type: 'work' },
      { time: '10:00', title: 'ランニング', thought: '10kmのランニング。走っている間は何も考えない。身体が勝手に走る状態を目指す。', type: 'nature' },
      { time: '12:00', title: '音楽を聴く時間', thought: 'レコードを聴きながら昼食。音楽は言葉を超えた物語を教えてくれる。', type: 'mind' },
      { time: '21:00', title: '早めの就寝', thought: '夜9時には就寝。規則正しい生活こそが長編小説を書き続ける秘訣。', type: 'mind' },
    ],
  },
  {
    id: 10,
    name: 'フォトグラファー',
    title: '光を読む一日',
    color: 'bg-zinc-100 text-zinc-800',
    category: 'creative',
    routine: [
      { time: '05:00', endTime: '06:30', title: 'ゴールデンアワー撮影', thought: '日の出前に撮影ポイントに到着。光が最も美しい時間は二度と来ない。', type: 'work' },
      { time: '09:00', endTime: '11:00', title: '写真の選定・編集', thought: '撮った写真を厳選。100枚から1枚を選ぶ目を養う。', type: 'work' },
      { time: '14:00', endTime: '15:00', title: '撮影散歩', thought: '街を歩き、何気ない日常の中に物語を探す。見慣れた景色を新しい目で。', type: 'nature' },
      { time: '20:00', endTime: '21:00', title: '巨匠の作品研究', thought: '写真集を開き、巨匠たちの構図と光を学ぶ。インプットなくしてアウトプットなし。', type: 'mind' },
    ],
  },
  {
    id: 11,
    name: '音楽プロデューサー',
    title: '音と静寂のリズム',
    color: 'bg-fuchsia-100 text-fuchsia-800',
    category: 'creative',
    routine: [
      { time: '07:00', endTime: '07:30', title: '音の散歩', thought: '朝の散歩で耳を澄ます。鳥の声、風の音、街のリズムがインスピレーション。', type: 'nature' },
      { time: '10:00', endTime: '13:00', title: 'スタジオ作業', thought: '午前中は新しいビートやメロディを作る。批判せず、ただ出し続ける。', type: 'work' },
      { time: '15:00', endTime: '17:00', title: 'ミックス・仕上げ', thought: '午後は昨日の作品を客観的に聴き直し、磨き上げる。', type: 'work' },
      { time: '21:00', endTime: '22:00', title: '音楽鑑賞', thought: 'ジャンルを問わず音楽を聴く。自分の守備範囲の外にヒントがある。', type: 'mind' },
    ],
  },
  {
    id: 12,
    name: '料理人',
    title: '五感で味わう暮らし',
    color: 'bg-red-100 text-red-800',
    category: 'creative',
    routine: [
      { time: '05:30', endTime: '06:30', title: '早朝の市場巡り', thought: '早朝の市場で旬の食材を選ぶ。手に取り、香りを嗅ぎ、対話する。', type: 'nature' },
      { time: '08:00', endTime: '10:00', title: '下準備', thought: '下準備を丁寧に。整った環境が心の余裕を生み、料理の質を上げる。', type: 'work' },
      { time: '12:00', endTime: '14:00', title: '創作料理', thought: '昼のピークタイムは即興の連続。五感をフル活用して一皿を仕上げる。', type: 'work' },
      { time: '21:00', endTime: '21:30', title: 'レシピノート', thought: '今日の発見をノートに記録。失敗も成功も、次の一皿への糧にする。', type: 'mind' },
    ],
  },

  // ── Wellness ──
  {
    id: 5,
    name: '感謝の探求者',
    title: '感謝と内省',
    color: 'bg-purple-100 text-purple-800',
    category: 'wellness',
    routine: [
      { time: '06:00', endTime: '06:20', title: '朝の瞑想', thought: '朝の瞑想で内なる静寂を見つける。感謝の気持ちで心を満たす。', type: 'mind' },
      { time: '06:20', endTime: '07:00', title: '感謝ジャーナル', thought: '今日感謝できることを5つ書く。小さな喜びを見逃さない練習。', type: 'mind' },
      { time: '07:00', endTime: '08:00', title: '朝の散歩', thought: '自然の中を歩く。木々や光に意識を向け、身体と心を一致させる。', type: 'nature' },
      { time: '09:00', endTime: '11:00', title: '創造的な仕事', thought: '最もエネルギーがある時間帯に創造的な仕事を集中させる。', type: 'work' },
    ],
  },
  {
    id: 13,
    name: 'ヨガ講師',
    title: '呼吸とともに生きる',
    color: 'bg-emerald-100 text-emerald-800',
    category: 'wellness',
    routine: [
      { time: '05:30', endTime: '06:30', title: '太陽礼拝', thought: '太陽礼拝で身体を目覚めさせる。呼吸と動きを一つに。', type: 'nature' },
      { time: '06:30', endTime: '07:00', title: 'プラーナーヤーマ', thought: '呼吸法で心身のエネルギーを整える。吸う息で活力を、吐く息で不安を手放す。', type: 'mind' },
      { time: '10:00', endTime: '12:00', title: 'レッスン指導', thought: '生徒一人一人の身体に寄り添い、無理なく導く。教えることは学ぶこと。', type: 'work' },
      { time: '19:00', endTime: '19:30', title: '陰ヨガ', thought: '夜は陰ヨガで深くリラックス。今日の身体に感謝して、手放す練習。', type: 'nature' },
    ],
  },
  {
    id: 14,
    name: 'マラソンランナー',
    title: '限界の先にある景色',
    color: 'bg-lime-100 text-lime-800',
    category: 'wellness',
    routine: [
      { time: '05:00', endTime: '05:15', title: '体調チェック', thought: '起きたら心拍数と筋肉の状態を確認。身体の声を聴くことが怪我を防ぐ。', type: 'mind' },
      { time: '05:30', endTime: '07:00', title: '長距離ランニング', thought: '朝の涼しい時間に走る。最初の20分を我慢すれば、身体が走り方を思い出す。', type: 'nature' },
      { time: '07:30', endTime: '08:00', title: '回復食', thought: 'タンパク質と炭水化物を30分以内に。回復こそがトレーニングの本体。', type: 'nature' },
      { time: '21:00', endTime: '21:30', title: 'トレーニング記録', thought: '距離、心拍、感覚を記録。データと直感の両方を信じる。', type: 'mind' },
    ],
  },
  {
    id: 15,
    name: 'マインドフルネス指導者',
    title: '「今ここ」に帰る',
    color: 'bg-cyan-100 text-cyan-800',
    category: 'wellness',
    routine: [
      { time: '06:00', endTime: '06:45', title: '座禅瞑想', thought: '45分間、ただ座る。呼吸を数え、思考が流れるのを見守る。', type: 'mind' },
      { time: '07:00', endTime: '07:30', title: '丁寧な朝食', thought: '食事に全注意を向ける。一口ごとの味、温度、食感を味わい尽くす。', type: 'nature' },
      { time: '12:00', endTime: '12:15', title: 'ボディスキャン', thought: '昼休みに全身をスキャン。緊張している場所に気づき、意識的に力を抜く。', type: 'mind' },
      { time: '21:00', endTime: '21:20', title: '慈悲の瞑想', thought: '慈悲の瞑想で一日を終える。自分、大切な人、すべての人に優しさを送る。', type: 'mind' },
    ],
  },

  // ── Morning ──
  {
    id: 16,
    name: '早起き実践者',
    title: '5AM Club',
    color: 'bg-yellow-100 text-yellow-800',
    category: 'morning',
    routine: [
      { time: '05:00', endTime: '05:20', title: '朝の運動', thought: '起きたら即運動。20分の激しい運動で脳にBDNFを送り込む。', type: 'nature' },
      { time: '05:20', endTime: '05:40', title: '内省の時間', thought: '瞑想とジャーナリング。内面を整理し、今日のビジョンを明確にする。', type: 'mind' },
      { time: '05:40', endTime: '06:00', title: '自己成長タイム', thought: '読書や学習。世界のトップ5%は皆、朝に自己投資している。', type: 'mind' },
      { time: '06:00', endTime: '08:00', title: '至高の集中時間', thought: '誰にも邪魔されない2時間。この「天才の時間」が人生を変える。', type: 'work' },
    ],
  },
  {
    id: 17,
    name: '夜型→朝型チャレンジ',
    title: '朝型シフト挑戦記',
    color: 'bg-indigo-100 text-indigo-800',
    category: 'morning',
    routine: [
      { time: '06:30', endTime: '06:45', title: '光を浴びる', thought: '起きたらすぐ明るい光を浴びる。体内時計をリセットする最も効果的な方法。', type: 'nature' },
      { time: '06:45', endTime: '07:00', title: '冷水シャワー', thought: '冷水シャワーで交感神経をオン。不快感を乗り越える小さな勝利が一日を変える。', type: 'nature' },
      { time: '07:00', endTime: '08:00', title: '最重要タスク', thought: '一番やりたくないタスクを最初に。朝の意志力が最も強い時間に片づける。', type: 'work' },
      { time: '22:00', endTime: '22:15', title: '入眠準備', thought: 'ブルーライトを遮断し、明日の朝を楽にする準備。夜を制する者が朝を制す。', type: 'mind' },
    ],
  },

  // ── Minimalist ──
  {
    id: 6,
    name: '深い読書家',
    title: '思考と読書の技法',
    color: 'bg-teal-100 text-teal-800',
    category: 'minimalist',
    routine: [
      { time: '07:00', endTime: '07:30', title: 'スマホを触らない朝', thought: '起床後1時間はスマートフォンを触らない。自分の思考を外部に汚染させない。', type: 'mind' },
      { time: '07:30', endTime: '09:00', title: 'じっくり読書', thought: '本を1〜2時間読む。ツイートではなく書籍から知識を得る。', type: 'mind' },
      { time: '09:00', endTime: '10:00', title: '運動', thought: '運動は投資。身体の健康なくして精神の鋭さはない。', type: 'nature' },
      { time: '10:00', endTime: '13:00', title: '深い思考', thought: 'カレンダーを空白にして深く考える時間を守る。忙しさは怠惰の一形態。', type: 'work' },
    ],
  },
  {
    id: 7,
    name: '茶道の実践者',
    title: '茶道に学ぶ余白',
    color: 'bg-amber-100 text-amber-800',
    category: 'minimalist',
    routine: [
      { time: '05:30', endTime: '06:00', title: '朝の茶事', thought: '朝のお茶を丁寧に点てる。所作に集中することで、一日の雑念を払う。', type: 'mind' },
      { time: '06:00', endTime: '06:45', title: '散歩と観察', thought: '近所を歩きながら季節の変化を観察する。見慣れた道に新しい発見を探す。', type: 'nature' },
      { time: '09:00', endTime: '12:00', title: '集中作業', thought: '午前中は外部からの連絡を断ち、最も重要な一つの仕事だけに向き合う。', type: 'work' },
      { time: '20:00', endTime: '21:00', title: '読書と余白', thought: '就寝前は読書か何もしない時間。余白こそが翌日のアイデアを育てる。', type: 'mind' },
    ],
  },
  {
    id: 18,
    name: 'デジタルノマド',
    title: '場所を選ばない自由',
    color: 'bg-orange-50 text-orange-700',
    category: 'minimalist',
    routine: [
      { time: '07:00', endTime: '07:30', title: '朝の散歩', thought: '新しい街でも朝の散歩は欠かさない。知らない路地に迷い込むのが楽しみ。', type: 'nature' },
      { time: '08:00', endTime: '08:15', title: 'カフェ探し', thought: 'Wi-Fiと電源がある良いカフェを見つける。環境が変われば発想も変わる。', type: 'work' },
      { time: '09:00', endTime: '13:00', title: '集中して仕事', thought: '午前中に集中して稼ぐ。午後は自分の時間。これがノマドの鉄則。', type: 'work' },
      { time: '16:00', endTime: '17:00', title: '街の探索', thought: '地元の市場や美術館を巡る。旅と仕事の境界線を溶かすのがこの生き方。', type: 'nature' },
    ],
  },
  {
    id: 19,
    name: 'エッセンシャリスト',
    title: 'より少なく、より良く',
    color: 'bg-stone-100 text-stone-700',
    category: 'minimalist',
    routine: [
      { time: '06:00', endTime: '06:30', title: '静寂の時間', thought: '起きたら30分間、何もしない。静寂の中で今日本当にやるべきことを見極める。', type: 'mind' },
      { time: '07:00', endTime: '07:15', title: '一つの最重要事項', thought: '今日のたった1つの最重要タスクを決める。それ以外は全て「いい」こと止まり。', type: 'mind' },
      { time: '09:00', endTime: '12:00', title: '本質的な仕事', thought: 'その1つに全力を注ぐ。多くのことを中途半端にやるより、1つを完璧に。', type: 'work' },
      { time: '18:00', endTime: '19:00', title: 'デジタルオフ', thought: 'デバイスをすべてオフに。家族との時間、自然との時間に全身で向き合う。', type: 'nature' },
    ],
  },

  // ── Student ──
  {
    id: 20,
    name: '医学生',
    title: '知識の海を泳ぐ',
    color: 'bg-blue-50 text-blue-700',
    category: 'student',
    routine: [
      { time: '06:00', endTime: '06:30', title: 'アクティブリコール', thought: '昨日の講義内容をノートを見ずに思い出す。記憶は「引き出す」ことで定着する。', type: 'mind' },
      { time: '07:00', endTime: '12:00', title: '講義と実習', thought: '授業中は理解に集中し、疑問点をリアルタイムで書き留める。', type: 'work' },
      { time: '14:00', endTime: '17:00', title: 'グループ学習', thought: '仲間に教えることで自分の理解が深まる。教える準備が最高の復習。', type: 'work' },
      { time: '21:00', endTime: '21:30', title: '間隔反復復習', thought: '間隔反復で重要事項を復習。忘却曲線に逆らうのではなく、利用する。', type: 'mind' },
    ],
  },
  {
    id: 21,
    name: '研究者',
    title: '問いを磨く日々',
    color: 'bg-violet-100 text-violet-800',
    category: 'student',
    routine: [
      { time: '06:30', endTime: '07:00', title: '論文精読', thought: '朝一番に最新の論文を1本精読。コーヒーと共に知識のフロンティアを確認。', type: 'mind' },
      { time: '09:00', endTime: '12:00', title: '研究作業', thought: '午前中はデータ分析と執筆に集中。誰にも邪魔されない時間が研究の質を決める。', type: 'work' },
      { time: '14:00', endTime: '15:00', title: 'ラボミーティング', thought: 'チームで進捗を共有し、互いの盲点を指摘し合う。科学は一人ではできない。', type: 'work' },
      { time: '19:00', endTime: '19:30', title: '研究ジャーナル', thought: '今日の発見と疑問を書き出す。答えより、良い問いを持つことが大切。', type: 'mind' },
    ],
  },
  {
    id: 22,
    name: '文武両道の学生',
    title: '文武両道の設計図',
    color: 'bg-green-100 text-green-800',
    category: 'student',
    routine: [
      { time: '05:30', endTime: '07:00', title: '早朝練習', thought: '早朝トレーニング。まだ誰もいないグラウンドで、昨日の自分を超える。', type: 'nature' },
      { time: '08:00', endTime: '12:00', title: '授業', thought: '授業は100%集中。限られた時間だからこそ、一回で吸収する。', type: 'work' },
      { time: '15:00', endTime: '17:00', title: 'チーム練習', thought: 'チーム練習は全力で。仲間と切磋琢磨する時間が成長を加速させる。', type: 'nature' },
      { time: '20:00', endTime: '21:00', title: '自習タイム', thought: 'テスト前だけでなく毎日1時間。積み重ねが焦りを消す。', type: 'mind' },
    ],
  },

  // ── More Business ──
  {
    id: 23,
    name: 'フリーランスデザイナー',
    title: '自分だけの時間割',
    color: 'bg-pink-100 text-pink-800',
    category: 'creative',
    routine: [
      { time: '08:00', endTime: '08:30', title: 'インスピレーション収集', thought: 'Dribbble、Behanceを眺めてインスピレーションを充填。目を肥やす時間。', type: 'mind' },
      { time: '09:00', endTime: '12:00', title: 'クライアントワーク', thought: '午前中はクライアントワーク。納期のあるものを集中力が高い時間に。', type: 'work' },
      { time: '14:00', endTime: '16:00', title: '個人プロジェクト', thought: '午後は自分のプロジェクト。受注仕事だけでは表現が枯れてしまう。', type: 'work' },
      { time: '17:00', endTime: '17:30', title: 'スキル練習', thought: '新しいツールや技法を30分だけ試す。小さな実験の積み重ねがスキルを広げる。', type: 'mind' },
    ],
  },
  {
    id: 24,
    name: '働く親',
    title: '家族と夢の両立',
    color: 'bg-warm-100 text-amber-700',
    category: 'morning',
    routine: [
      { time: '05:00', endTime: '06:00', title: '自分の1時間', thought: '家族が起きる前の1時間が自分への投資時間。読書、運動、何でもいい。', type: 'mind' },
      { time: '06:00', endTime: '07:30', title: '家族の朝時間', thought: '朝食を一緒に。何気ない会話が子どもの記憶に残る。', type: 'nature' },
      { time: '09:00', endTime: '15:00', title: '集中ワーク', thought: 'お迎えまでの時間を最大効率で。完璧主義を捨て、80%で次へ進む。', type: 'work' },
      { time: '20:30', endTime: '21:00', title: '感謝の振り返り', thought: '寝かしつけの後、今日の小さな幸せを振り返る。忙しい日ほど感謝が大事。', type: 'mind' },
    ],
  },
  {
    id: 25,
    name: '園芸家',
    title: '土と季節に寄り添う',
    color: 'bg-green-50 text-green-700',
    category: 'wellness',
    routine: [
      { time: '06:00', endTime: '06:30', title: '庭の観察', thought: '朝露の中、庭を見回る。昨日なかった芽を見つけた時の喜びは格別。', type: 'nature' },
      { time: '07:00', endTime: '09:00', title: 'ガーデニング', thought: '土に触れ、水をやり、剪定する。植物の成長は焦っても早まらないことを教えてくれる。', type: 'nature' },
      { time: '10:00', endTime: '11:00', title: '縁側読書', thought: '縁側で本を読む。急ぐ必要のない読書ほど贅沢なものはない。', type: 'mind' },
      { time: '15:00', endTime: '16:00', title: 'ご近所散歩', thought: '近所を散歩して顔見知りと立ち話。人とのつながりが健康の土台。', type: 'nature' },
    ],
  },

  // ── Fitness ──
  {
    id: 26,
    name: '自宅トレーナー',
    title: '自宅で鍛える毎日',
    color: 'bg-red-100 text-red-800',
    category: 'fitness',
    routine: [
      { time: '06:00', endTime: '06:15', title: 'ウォーミングアップ', thought: '動的ストレッチで体を目覚めさせる。怪我なく鍛えるための投資。', type: 'nature' },
      { time: '06:15', endTime: '07:00', title: 'HIIT運動', thought: '20分のHIITで心拍を上げる。短時間で最大効果。言い訳なし。', type: 'nature' },
      { time: '07:00', endTime: '07:30', title: '高タンパク朝食', thought: 'トレーニング後30分以内にタンパク質を。筋肉の回復が成長の鍵。', type: 'nature' },
      { time: '21:00', endTime: '21:15', title: 'フォームローラー', thought: '寝る前にフォームローラーで筋膜をほぐす。明日の体が変わる。', type: 'mind' },
    ],
  },
  {
    id: 27,
    name: 'ジム愛好家',
    title: '鉄と向き合う朝',
    color: 'bg-red-50 text-red-700',
    category: 'fitness',
    routine: [
      { time: '05:30', endTime: '06:00', title: 'トレーニング前の食事', thought: 'バナナとコーヒー。胃に負担をかけず、エネルギーを確保する。', type: 'nature' },
      { time: '06:00', endTime: '07:30', title: 'ウエイトトレーニング', thought: '今日は脚の日。スクワット、レッグプレス。基礎を積み重ねる。', type: 'nature' },
      { time: '07:30', endTime: '08:00', title: 'ストレッチ', thought: 'トレーニング後の静的ストレッチ。柔軟性が強さの基盤。', type: 'nature' },
      { time: '20:00', endTime: '20:30', title: 'トレーニング記録', thought: '重量と回数を記録。前回の自分を超えるのが唯一の目標。', type: 'mind' },
    ],
  },
  {
    id: 28,
    name: 'スイマー',
    title: '水と一体になる朝',
    color: 'bg-sky-100 text-sky-800',
    category: 'fitness',
    routine: [
      { time: '05:30', endTime: '05:45', title: '軽いストレッチ', thought: '肩と股関節を丁寧にほぐす。水中で滑らかに動くための準備。', type: 'nature' },
      { time: '06:00', endTime: '07:00', title: '水泳練習', thought: '1500mを泳ぐ。水の中では自分の呼吸だけが聞こえる。最高の瞑想。', type: 'nature' },
      { time: '07:15', endTime: '07:45', title: '回復食', thought: '炭水化物とタンパク質をバランスよく。水泳は全身運動、回復が大事。', type: 'nature' },
      { time: '21:00', endTime: '21:15', title: '就寝準備', thought: '水泳の日は深く眠れる。ストレッチだけして早めに就寝。', type: 'mind' },
    ],
  },
  {
    id: 29,
    name: '週末ハイカー',
    title: '山が教えてくれること',
    color: 'bg-green-100 text-green-800',
    category: 'fitness',
    routine: [
      { time: '05:00', endTime: '05:30', title: '装備の確認', thought: '装備を確認する。準備の丁寧さが安全な山行を支える。', type: 'work' },
      { time: '06:00', endTime: '11:00', title: '登山', thought: '一歩一歩、自分のペースで登る。山頂ではなく、過程に価値がある。', type: 'nature' },
      { time: '12:00', endTime: '12:30', title: '山頂ランチ', thought: '山で食べるおにぎりは格別。景色と達成感が最高の調味料。', type: 'nature' },
      { time: '19:00', endTime: '19:30', title: '登山日記', thought: '今日のルートと発見を記録。次の山行の計画を夢想する。', type: 'mind' },
    ],
  },
  {
    id: 30,
    name: '自転車通勤者',
    title: 'ペダルを踏む哲学',
    color: 'bg-orange-100 text-orange-700',
    category: 'fitness',
    routine: [
      { time: '06:30', endTime: '07:00', title: '自転車メンテナンス', thought: '週に一度のタイヤチェックとチェーン洗浄。愛車は手入れに応えてくれる。', type: 'work' },
      { time: '07:00', endTime: '07:45', title: '自転車通勤', thought: '風を切って走る45分。満員電車では得られない朝の爽快感。', type: 'nature' },
      { time: '12:00', endTime: '12:30', title: '昼のストレッチ', thought: '昼休みに腰と脚をストレッチ。デスクワークとのバランス。', type: 'nature' },
      { time: '18:00', endTime: '18:45', title: '自転車で帰宅', thought: '帰り道は少し遠回り。夕暮れの景色が一日の疲れを洗い流す。', type: 'nature' },
    ],
  },

  // ── Cooking ──
  {
    id: 31,
    name: '朝のパン職人',
    title: '焼きたてパンの朝',
    color: 'bg-amber-100 text-amber-800',
    category: 'cooking',
    routine: [
      { time: '05:00', endTime: '05:30', title: '生地の確認', thought: '前夜に仕込んだ生地を確認。発酵の具合で今日のパンが決まる。', type: 'work' },
      { time: '05:30', endTime: '06:30', title: 'パン焼き', thought: 'オーブンの温度を見極める。焼き上がりの香りが家族を起こす。', type: 'work' },
      { time: '07:00', endTime: '07:30', title: '家族の朝食', thought: '焼きたてのパンを囲む朝食。この時間のために早起きする。', type: 'nature' },
      { time: '20:00', endTime: '20:30', title: 'レシピ研究', thought: '新しいレシピを研究。明日はどんなパンを焼こうか。', type: 'mind' },
    ],
  },
  {
    id: 32,
    name: '作り置き名人',
    title: '一週間を料理で設計する',
    color: 'bg-yellow-100 text-yellow-700',
    category: 'cooking',
    routine: [
      { time: '08:00', endTime: '08:30', title: '献立作成', thought: '��週の献立を考える。栄養バランスと食材のロスを最小化。', type: 'work' },
      { time: '09:00', endTime: '11:00', title: 'まとめて調理', thought: '5日分の主菜と副菜を一気に調理。効率と味の両立が腕の見せどころ。', type: 'work' },
      { time: '11:00', endTime: '11:30', title: '小分け作業', thought: '容器に詰め分ける。平日の自分への贈��物。', type: 'work' },
      { time: '19:00', endTime: '19:30', title: '試食と調整', thought: '今日の分を食べて味を確認。次回��改善点をメモ。', type: 'mind' },
    ],
  },
  {
    id: 33,
    name: '発酵愛好家',
    title: '発酵が紡ぐ暮らし',
    color: 'bg-amber-50 text-amber-700',
    category: 'cooking',
    routine: [
      { time: '06:30', endTime: '07:00', title: '発酵食品の観察', thought: '味噌、ぬか漬け、コンブチャの様子を見る。微生物との対話。', type: 'nature' },
      { time: '07:00', endTime: '07:30', title: '発酵食の朝食', thought: '自家製ヨーグルトと漬物の朝食。腸から健康を作る。', type: 'nature' },
      { time: '12:00', endTime: '12:30', title: '季節の仕込み', thought: '旬の食材で新しい発酵食品を仕込む。季節を味わう暮らし。', type: 'work' },
      { time: '20:00', endTime: '20:30', title: '発酵記録', thought: '温��、日数、味の変化を記録。発酵は科学でもあり芸術でもある。', type: 'mind' },
    ],
  },
  {
    id: 34,
    name: 'スパイス探求家',
    title: 'スパイスで世界を旅する',
    color: 'bg-orange-100 text-orange-800',
    category: 'cooking',
    routine: [
      { time: '07:00', endTime: '07:30', title: 'チャイを淹れる', thought: 'カ���ダモン、シナモン、ジン���ャー。毎朝のチャイが一日を温める。', type: 'nature' },
      { time: '11:00', endTime: '12:00', title: 'スパイス料理', thought: '今日はモロッコ風タジ���。スパイスの組み合わ���で異国の風を感じる���', type: 'work' },
      { time: '15:00', endTime: '15:30', title: 'スパイス店巡��', thought: 'スパイス専門店を巡る。知らない香りとの出会いが新しい料理を生む。', type: 'nature' },
      { time: '21:00', endTime: '21:30', title: 'レシピ記録', thought: '今日の配合を記録。同じ料理は二度と作れない。それが手��理の魅力。', type: 'mind' },
    ],
  },
  {
    id: 35,
    name: '弁当アーティスト',
    title: '小さな箱に詰める愛',
    color: 'bg-pink-100 text-pink-700',
    category: 'cooking',
    routine: [
      { time: '05:30', endTime: '06:00', title: '弁当作り', thought: '彩りと栄養を考えた弁当作り。限られたスペースに工夫を詰める。', type: 'work' },
      { time: '06:00', endTime: '06:15', title: '写真を撮る', thought: '完成した弁当を写真に残す。小さな達成感が毎朝の原動力。', type: 'mind' },
      { time: '12:00', endTime: '12:30', title: 'ランチタイム', thought: '自分で作った弁当を開ける瞬間。朝の自分に感謝する。', type: 'nature' },
      { time: '20:00', endTime: '20:30', title: '明日の構想', thought: '冷蔵庫の在庫を確認し、明日の弁当を構想する。', type: 'work' },
    ],
  },

  // ── Reading ──
  {
    id: 36,
    name: '週1冊の読書家',
    title: '週1冊の知的冒険',
    color: 'bg-indigo-100 text-indigo-800',
    category: 'reading',
    routine: [
      { time: '06:00', endTime: '07:00', title: '朝の読書', thought: '朝の1時間は読書に捧げる。最も集中できる時間に最も価値ある活動を。', type: 'mind' },
      { time: '12:30', endTime: '13:00', title: '昼休みの読書', thought: '昼休みに30分。少しずつでも毎日読む習慣が年間50冊を可能にする。', type: 'mind' },
      { time: '19:00', endTime: '19:30', title: '読書メモ', thought: '印象に残った箇所をノートに書き出す。読むだけでは知識は定着しない。', type: 'mind' },
      { time: '21:00', endTime: '21:30', title: '次の一冊を選ぶ', thought: '次の一冊を選ぶ。ジャンルを意図的に変えることで視野が広がる。', type: 'mind' },
    ],
  },
  {
    id: 37,
    name: 'オーディオブック散歩',
    title: '耳で読む散歩道',
    color: 'bg-violet-100 text-violet-700',
    category: 'reading',
    routine: [
      { time: '06:30', endTime: '07:30', title: '聴きながら散歩', thought: 'オーディオブックを聴きながら朝の散歩。身体と知性を同時に動かす。', type: 'nature' },
      { time: '12:00', endTime: '12:30', title: '移動中のリスニング', thought: '移動時間をオーディオブックに。「時間がない」は言い訳にならない。', type: 'mind' },
      { time: '18:00', endTime: '18:15', title: '要点メモ', thought: '今日聴いた内容の要点を3つメモ。アウトプットが理解を深める。', type: 'mind' },
      { time: '21:00', endTime: '21:15', title: 'ポッドキャスト', thought: '寝る前は軽いポッドキャスト。エンタメと学びの境界を楽しむ。', type: 'mind' },
    ],
  },
  {
    id: 38,
    name: '図書館の常連',
    title: '図書館という聖域',
    color: 'bg-stone-100 text-stone-700',
    category: 'reading',
    routine: [
      { time: '09:00', endTime: '09:15', title: '図書館への道', thought: '開館と同時に到着する。静かな空間に包まれる贅沢。', type: 'nature' },
      { time: '09:15', endTime: '12:00', title: '集中読書', thought: 'スマホを鞄にしまい、本だけに向き合う3時間。家では得られない集中。', type: 'mind' },
      { time: '12:00', endTime: '12:30', title: '本との出会い', thought: '書棚を巡る。偶然の出会いがある棚こそ、検索では見つからない宝。', type: 'mind' },
      { time: '20:00', endTime: '20:30', title: '読書日記', thought: '今日読んだ本の感想を書く。自分だけの書評を積み重ねる。', type: 'mind' },
    ],
  },
  {
    id: 39,
    name: '読書会リーダー',
    title: '共に学ぶ力',
    color: 'bg-blue-100 text-blue-700',
    category: 'reading',
    routine: [
      { time: '06:00', endTime: '07:00', title: '課題図書の予習', thought: '読書会の課題図書を予習。自分の意見を持って臨む準備。', type: 'mind' },
      { time: '10:00', endTime: '12:00', title: '読書会', thought: '同じ本でも10人いれば10通りの解釈がある。対話が理解を深める。', type: 'work' },
      { time: '14:00', endTime: '14:30', title: '議論メモ', thought: '議論で得た新しい視点をまとめる。一人では到達できない場所がある。', type: 'mind' },
      { time: '21:00', endTime: '21:30', title: '自由な読書', thought: '夜は好きな本を自由に。義務のない読書が一番贅沢。', type: 'mind' },
    ],
  },
  {
    id: 40,
    name: '漫画研究家',
    title: '漫画から学ぶ人生',
    color: 'bg-rose-100 text-rose-700',
    category: 'reading',
    routine: [
      { time: '07:00', endTime: '07:30', title: '朝の連載チェック', thought: '朝の連載チェック。物語の続きが気になるから早起きできる。', type: 'mind' },
      { time: '12:00', endTime: '12:30', title: 'ジャンル開拓', thought: '普段読まないジャンルに挑戦。少女漫画からビジネス漫画まで。', type: 'mind' },
      { time: '19:00', endTime: '19:30', title: '構図と表現の研究', thought: 'コマ割りと構図を分析する。漫画は映画と文学の融合芸術。', type: 'mind' },
      { time: '21:00', endTime: '22:00', title: '長編漫画に没頭', thought: '夜は長編漫画に没頭。100巻の大河ドラマに身を委ねる幸せ。', type: 'mind' },
    ],
  },

  // ── Nightowl ──
  {
    id: 41,
    name: '深夜のプログラマー',
    title: '深夜のキーボード',
    color: 'bg-slate-800 text-slate-100',
    category: 'nightowl',
    routine: [
      { time: '10:00', endTime: '10:30', title: 'ゆっくり起床', thought: '急がない朝。身体が完全に目覚めるまで待つのが夜型の作法。', type: 'mind' },
      { time: '14:00', endTime: '18:00', title: '日中の定型業務', thought: '午後にミーティングと定型作業を片付ける。夜のための準備時間。', type: 'work' },
      { time: '22:00', endTime: '02:00', title: '深夜のコーディング', thought: 'Slackが止まり、世界が静まる。ここからが本当の生産時間。', type: 'work' },
      { time: '02:00', endTime: '02:30', title: '就寝準備', thought: 'ブルーライトフィルターをオン。明日の自分にコードレビューを託す。', type: 'mind' },
    ],
  },
  {
    id: 42,
    name: '夜の作家',
    title: '月明かりの執筆',
    color: 'bg-indigo-900 text-indigo-100',
    category: 'nightowl',
    routine: [
      { time: '11:00', endTime: '11:30', title: '遅めの朝食', thought: 'ブランチスタイルの朝食。急がない朝が創造性を守る。', type: 'nature' },
      { time: '15:00', endTime: '17:00', title: '取材とインプット', thought: '午後は取材やインプットの時間。夜の執筆の材料を集める。', type: 'work' },
      { time: '21:00', endTime: '01:00', title: '執筆タイム', thought: '夜の静寂が言葉を引き出す。昼間には書けない文章がある。', type: 'work' },
      { time: '01:00', endTime: '01:30', title: '読書', thought: '書いた後は読む。他の作家の文章が明日の自分を育てる。', type: 'mind' },
    ],
  },
  {
    id: 43,
    name: '夜勤ワーカー',
    title: '逆転する昼と夜',
    color: 'bg-gray-700 text-gray-100',
    category: 'nightowl',
    routine: [
      { time: '15:00', endTime: '15:30', title: '起床ルーティン', thought: '遮光カーテンを開ける。午後の光で体内時計をリセット。', type: 'nature' },
      { time: '16:00', endTime: '16:30', title: '運動', thought: '出勤前の運動。夜勤の体力を維持するための必須習慣。', type: 'nature' },
      { time: '22:00', endTime: '06:00', title: '夜勤', thought: '夜の静かな環境で集中できる。この時間帯が自分のゴールデンタイム。', type: 'work' },
      { time: '07:00', endTime: '07:30', title: '朝のクールダウン', thought: '朝日を浴びてからブラインドを閉じる。質の高い睡眠への切り替え。', type: 'mind' },
    ],
  },
  {
    id: 44,
    name: '星空観察者',
    title: '星空の下で考える',
    color: 'bg-violet-900 text-violet-100',
    category: 'nightowl',
    routine: [
      { time: '09:00', endTime: '09:30', title: 'ゆるやかな朝', thought: 'ゆっくり起きて、昨夜の観察記録を整理する。', type: 'mind' },
      { time: '14:00', endTime: '16:00', title: '天文学の勉強', thought: '天体の動きを学ぶ。今夜何が見えるかを調べる時間。', type: 'mind' },
      { time: '21:00', endTime: '21:30', title: '機材のセットアップ', thought: '望遠鏡のセットアップと空の状態確認。準備が観察の質を決める。', type: 'work' },
      { time: '23:00', endTime: '01:00', title: '星空観察', thought: '宇宙を眺める。自分の悩みが小さく感じる瞬間。', type: 'nature' },
    ],
  },
  {
    id: 45,
    name: '深夜のDJ',
    title: '夜を彩る音楽',
    color: 'bg-purple-900 text-purple-100',
    category: 'nightowl',
    routine: [
      { time: '12:00', endTime: '12:30', title: '新譜チェック', thought: '新譜をチェック。今夜のセットリストに使えるか試聴する。', type: 'mind' },
      { time: '15:00', endTime: '17:00', title: 'ミックス練習', thought: 'BPMの異なる曲を滑らかにつなぐ練習。技術は反復が作る。', type: 'work' },
      { time: '22:00', endTime: '02:00', title: 'ライブセット', thought: 'フロアの空気を読みながら選曲する。音楽と人をつなぐ仕事。', type: 'work' },
      { time: '02:30', endTime: '03:00', title: 'セッション記録', thought: '今夜のセットを振り返る。どの曲でフロアが動いたかを記録。', type: 'mind' },
    ],
  },

  // ── Productivity ──
  {
    id: 46,
    name: 'GTD実践者',
    title: '頭を空にする技術',
    color: 'bg-blue-100 text-blue-800',
    category: 'productivity',
    routine: [
      { time: '06:00', endTime: '06:30', title: '受信箱ゼロ', thought: '全ての受信箱を空にする。メール、メモ、タスクを一箇所に集約。', type: 'work' },
      { time: '06:30', endTime: '07:00', title: '今日の計画', thought: '今日の最重要タスク3つを選ぶ。多すぎる計画は計画ではない。', type: 'mind' },
      { time: '09:00', endTime: '11:00', title: '最重要タスク集中', thought: '最も重要なタスクに2時間集中。通知オフ、ドアを閉める。', type: 'work' },
      { time: '17:00', endTime: '17:15', title: '一日の振り返り', thought: '完了したタスクにチェックを入れる。この小さな達成感が明日を動かす。', type: 'mind' },
    ],
  },
  {
    id: 47,
    name: 'ポモドーロの達人',
    title: '25分の集中革命',
    color: 'bg-red-100 text-red-700',
    category: 'productivity',
    routine: [
      { time: '08:00', endTime: '08:25', title: '第1ポモドーロ', thought: '最初の25分。まず始めることが最大のハードル。タイマーが背中を押す。', type: 'work' },
      { time: '08:30', endTime: '08:55', title: '第2ポモドーロ', thought: '2セット目。集中の波に乗れている。休憩で立ち上がるのを忘れずに。', type: 'work' },
      { time: '09:00', endTime: '09:25', title: '第3ポモドーロ', thought: '3セット目で深い集中状態に入る。フロー状態の入口。', type: 'work' },
      { time: '09:30', endTime: '09:45', title: '長い休憩', thought: '4ポモドーロ後の長い休憩。散歩か軽いストレッチで脳をリセット。', type: 'nature' },
    ],
  },
  {
    id: 48,
    name: 'タイムブロッカー',
    title: 'カレンダーが教える自分',
    color: 'bg-teal-100 text-teal-700',
    category: 'productivity',
    routine: [
      { time: '06:00', endTime: '06:30', title: 'ブロック計画', thought: '今日の全時間をブロックに分ける。空白の時間を作らない設計。', type: 'work' },
      { time: '09:00', endTime: '12:00', title: '集中作業ブロック', thought: '午前は創造的な仕事のブロック。会議を入れない聖域。', type: 'work' },
      { time: '13:00', endTime: '15:00', title: 'コミュニケーション時間', thought: '午後前半は会議とメール。まとめて処理する効率の魔法。', type: 'work' },
      { time: '17:00', endTime: '17:30', title: '明日の設計', thought: '明日のブロックを設計する。今日の反省を明日に活かす。', type: 'mind' },
    ],
  },
  {
    id: 49,
    name: 'セカンドブレイン構築者',
    title: '第二の脳を育てる',
    color: 'bg-emerald-100 text-emerald-700',
    category: 'productivity',
    routine: [
      { time: '07:00', endTime: '07:30', title: 'デイリーキャプチャー', thought: '昨日のメモ、ブックマーク、アイデアをデジタルノートに整理。', type: 'work' },
      { time: '09:00', endTime: '09:30', title: 'ノートの連結', thought: 'ノート同士をリンクでつなぐ。知識のネットワークが発想を生む。', type: 'mind' },
      { time: '14:00', endTime: '14:30', title: '段階的要約', thought: '過去のノートを要約し直す。情報は何度も触れることで知恵になる。', type: 'mind' },
      { time: '20:00', endTime: '20:30', title: '週次レビュー', thought: '1週間のノートを俯瞰する。点と点がつながる瞬間が来る。', type: 'mind' },
    ],
  },
  {
    id: 50,
    name: 'エネルギー管理術',
    title: 'エネルギーで一日を設計する',
    color: 'bg-yellow-100 text-yellow-800',
    category: 'productivity',
    routine: [
      { time: '06:00', endTime: '06:30', title: 'エネルギーチェック', thought: '今日の体調とエネルギーレベルを10段階で記録。自己認識が第一歩。', type: 'mind' },
      { time: '09:00', endTime: '11:00', title: '最高パフォーマンス', thought: 'エネルギーが最高の時間に最重要タスクを。時間ではなくエネルギーを管理する。', type: 'work' },
      { time: '14:00', endTime: '14:15', title: 'パワーナップ', thought: '15分の昼寝で午後のエネルギーを回復。罪悪感は不要。', type: 'mind' },
      { time: '18:00', endTime: '18:30', title: 'エネルギー振り返り', thought: '何にエネルギーを奪われたかを振り返る。明日はその罠を避ける。', type: 'mind' },
    ],
  },

  // ── Parenting ──
  {
    id: 51,
    name: '新米パパ・ママ',
    title: '赤ちゃんと歩む日々',
    color: 'bg-pink-100 text-pink-800',
    category: 'parenting',
    routine: [
      { time: '05:00', endTime: '05:30', title: '静かな自分時間', thought: '赤ちゃんが寝ている間の自分だけの30分。この時間が一日を支える。', type: 'mind' },
      { time: '07:00', endTime: '08:00', title: '朝のお世話', thought: 'ミルク、おむつ替え、着替え。ルーティン化すると心に余裕が生まれる。', type: 'nature' },
      { time: '10:00', endTime: '11:00', title: '公園で外気浴', thought: '公園で外気浴。赤ちゃんの発見する目線で世界が新鮮に見える。', type: 'nature' },
      { time: '20:00', endTime: '20:30', title: 'パートナータイム', thought: '寝かしつけ後のパートナーとの時間。短くても大切な対話。', type: 'mind' },
    ],
  },
  {
    id: 52,
    name: '小学生の親',
    title: '学校と家庭のハーモニー',
    color: 'bg-sky-100 text-sky-700',
    category: 'parenting',
    routine: [
      { time: '06:00', endTime: '06:30', title: '弁当の準備', thought: '子どもの弁当を作る。手際よく、でも愛情は込めて。', type: 'work' },
      { time: '07:30', endTime: '08:00', title: '送り出し', thought: '玄関で「いってらっしゃい」。この一言が子どもの一日を支える。', type: 'nature' },
      { time: '15:00', endTime: '16:00', title: '宿題サポート', thought: '一緒に宿題に取り組む。教えるのではなく、考え方を示す。', type: 'work' },
      { time: '21:00', endTime: '21:30', title: '自分の時間', thought: '子どもが寝た後の自分時間。読書でもSNSでも、自分のために使う。', type: 'mind' },
    ],
  },
  {
    id: 53,
    name: 'ひとり親の奮闘',
    title: '一人二役の誇り',
    color: 'bg-amber-100 text-amber-700',
    category: 'parenting',
    routine: [
      { time: '05:30', endTime: '06:00', title: '朝の段取り', thought: '子どもが起きる前にすべてを準備。段取りが命。', type: 'work' },
      { time: '06:00', endTime: '07:00', title: '家族の朝食', thought: '一緒に食べる朝食は大切なコミュニケーションの時間。', type: 'nature' },
      { time: '09:00', endTime: '15:00', title: '仕事に集中', thought: '限られた時間で最大の成果を。時間の使い方は誰にも負けない。', type: 'work' },
      { time: '22:00', endTime: '22:30', title: '自分を労う時間', thought: '全てが終わった後の30分。明日のために今日の自分を労う。', type: 'mind' },
    ],
  },
  {
    id: 54,
    name: '遊びで育てる親',
    title: '遊びが育てる力',
    color: 'bg-lime-100 text-lime-800',
    category: 'parenting',
    routine: [
      { time: '07:00', endTime: '07:30', title: '朝の遊びタイム', thought: '朝の遊びタイム。ブロック、お絵描き、何でもOK。想像力は遊びから。', type: 'nature' },
      { time: '10:00', endTime: '11:00', title: '外遊び', thought: '外で思いっきり遊ぶ。泥だらけ上等。自然が最高の先生。', type: 'nature' },
      { time: '15:00', endTime: '15:30', title: '絵本の読み聞かせ', thought: '絵本の読み聞かせ。同じ本を何度でも。繰り返しが子どもの安心を作る。', type: 'mind' },
      { time: '19:00', endTime: '19:30', title: '振り返り', thought: '今日の子どもの成長を記録。小さな変化を見逃さない。', type: 'mind' },
    ],
  },
  {
    id: 55,
    name: '共同子育てパートナー',
    title: 'チームで育てる',
    color: 'bg-teal-100 text-teal-800',
    category: 'parenting',
    routine: [
      { time: '06:00', endTime: '06:30', title: '朝の担当', thought: '今朝は自分の担当。役割分担が信頼と余裕を生む。', type: 'nature' },
      { time: '08:00', endTime: '12:00', title: '仕事の時間', thought: 'パートナーが子どもを見てくれている間に集中する。感謝を忘れない。', type: 'work' },
      { time: '17:00', endTime: '17:30', title: '夕方の引き継ぎ', thought: '夕方の引き継ぎ。今日の様子を共有する。情報共有が連携の鍵。', type: 'work' },
      { time: '21:00', endTime: '21:30', title: '家族会議', thought: '週に一度の「家族会議」。予定、心配、喜びを分かち合う。', type: 'mind' },
    ],
  },

  // ── Travel ──
  {
    id: 56,
    name: 'バックパッカー',
    title: 'リュック一つで世界へ',
    color: 'bg-emerald-100 text-emerald-800',
    category: 'travel',
    routine: [
      { time: '06:00', endTime: '06:30', title: 'ホステルの朝', thought: '共有キッチンでコーヒーを淹れる。旅人同士の朝の会話が情報源。', type: 'nature' },
      { time: '07:00', endTime: '12:00', title: '街歩き', thought: 'ガイドブックを閉じて歩く。迷子になることが最高の発見を生む。', type: 'nature' },
      { time: '12:00', endTime: '13:00', title: '地元グルメ', thought: '地元の人が並ぶ店で食べる。食は文化を知る最短ルート。', type: 'nature' },
      { time: '20:00', endTime: '20:30', title: '旅日記', thought: '今日の出会いと発見を書く。記憶は薄れるが、文字は残る。', type: 'mind' },
    ],
  },
  {
    id: 57,
    name: '週末トリッパー',
    title: '週末は知らない街へ',
    color: 'bg-cyan-100 text-cyan-700',
    category: 'travel',
    routine: [
      { time: '06:00', endTime: '06:30', title: '早朝出発', thought: '始発に乗る。朝早い出発が旅の時間を最大化する。', type: 'nature' },
      { time: '09:00', endTime: '12:00', title: '到着地を歩く', thought: '到着したらまず歩く。街の空気感は歩かないとわからない。', type: 'nature' },
      { time: '14:00', endTime: '15:00', title: '穴場探し', thought: '観光名所ではなく、路地裏のカフェや地元の公園を探す。', type: 'nature' },
      { time: '19:00', endTime: '19:30', title: '旅の振り返り', thought: '帰りの電車で写真を見返す。次の週末の行き先を考え始める。', type: 'mind' },
    ],
  },
  {
    id: 58,
    name: 'スロートラベラー',
    title: '暮らすように旅する',
    color: 'bg-amber-50 text-amber-800',
    category: 'travel',
    routine: [
      { time: '07:30', endTime: '08:00', title: '朝市で買い物', thought: '地元の朝市で食材を買う。旅先でも自炊する贅沢。', type: 'nature' },
      { time: '08:00', endTime: '09:00', title: '自炊の朝食', thought: 'キッチン付きの宿で朝食を作る。暮らすように旅する幸せ。', type: 'nature' },
      { time: '10:00', endTime: '12:00', title: 'ご近所散歩', thought: '毎日同じ道を歩く。3日目から見える景色が変わってくる。', type: 'nature' },
      { time: '16:00', endTime: '17:00', title: 'カフェで記録', thought: '地元のカフェで旅の記録を書く。この街の常連になりたい。', type: 'mind' },
    ],
  },
  {
    id: 59,
    name: '冒険家',
    title: '未知への一歩',
    color: 'bg-orange-100 text-orange-800',
    category: 'travel',
    routine: [
      { time: '05:00', endTime: '05:30', title: '日の出を見る', thought: '旅先での日の出。同じ太陽でも違う場所から見ると別世界。', type: 'nature' },
      { time: '08:00', endTime: '12:00', title: 'アクティビティ', thought: 'カヤック、ダイビング、トレッキング。体験が旅の本質。', type: 'nature' },
      { time: '14:00', endTime: '15:00', title: '地元の人と交流', thought: '現地の人と話す。言葉が通じなくても笑顔は万国共通。', type: 'nature' },
      { time: '21:00', endTime: '21:30', title: '写真の編集', thought: '今日の冒険を写真で振り返る。次の旅のモチベーションに。', type: 'mind' },
    ],
  },
  {
    id: 60,
    name: '鉄道旅行家',
    title: '車窓から見る日本',
    color: 'bg-blue-50 text-blue-700',
    category: 'travel',
    routine: [
      { time: '07:00', endTime: '07:30', title: '駅弁選び', thought: '駅弁を選ぶ楽しみ。ご当地の味が旅の始まり。', type: 'nature' },
      { time: '07:30', endTime: '11:00', title: '列車の時間', thought: '車窓を眺めながら過ごす。スマホを置いて、流れる景色に身を任せる。', type: 'mind' },
      { time: '11:00', endTime: '12:00', title: '到着散策', thought: '降りた駅から歩き始める。計画しすぎない散策が思わぬ発見を呼ぶ。', type: 'nature' },
      { time: '18:00', endTime: '18:30', title: '次のルート計画', thought: '次の路線を調べる。時刻表を読むのは旅人の読書。', type: 'mind' },
    ],
  },

  // ── Spiritual ──
  {
    id: 61,
    name: '朝の瞑想者',
    title: '静寂から始まる一日',
    color: 'bg-purple-100 text-purple-800',
    category: 'spiritual',
    routine: [
      { time: '05:00', endTime: '05:45', title: '座禅', thought: '暗闇の中で座る。何も求めず、ただ存在することの練習。', type: 'mind' },
      { time: '05:45', endTime: '06:15', title: '読経・マントラ', thought: 'マントラを唱える。声の振動が心身を整える。', type: 'mind' },
      { time: '06:15', endTime: '06:45', title: '観照', thought: '今日の問いを一つ持つ。答えを急がず、問いと共に過ごす。', type: 'mind' },
      { time: '20:00', endTime: '20:30', title: '夜の感謝', thought: '一日の感謝を振り返る。当たり前の中に奇跡を見つける練習。', type: 'mind' },
    ],
  },
  {
    id: 62,
    name: '哲学の読者',
    title: '問い続ける人生',
    color: 'bg-stone-200 text-stone-800',
    category: 'spiritual',
    routine: [
      { time: '06:00', endTime: '07:00', title: '哲学書を読む', thought: '古典哲学を読む。2000年前の問いが今日の自分に響く不思議。', type: 'mind' },
      { time: '07:00', endTime: '07:30', title: 'ジャーナリング', thought: '読んだことについて自分の言葉で考えを書く。理解は言語化から。', type: 'mind' },
      { time: '12:00', endTime: '12:30', title: '歩く思索', thought: '散歩しながら午前の問いを反芻する。歩くと思考が動き出す。', type: 'nature' },
      { time: '21:00', endTime: '21:30', title: '哲学的対話', thought: '哲学的な対話を求める。一人の思考には限界がある。', type: 'mind' },
    ],
  },
  {
    id: 63,
    name: '自然のスピリチュアリスト',
    title: '自然に還る時間',
    color: 'bg-green-100 text-green-800',
    category: 'spiritual',
    routine: [
      { time: '05:30', endTime: '06:30', title: '森林散歩', thought: '森の中を歩く。木々の呼吸を感じ、自分も自然の一部だと思い出す。', type: 'nature' },
      { time: '06:30', endTime: '07:00', title: 'アーシング', thought: '裸足で大地に立つ。地球とつながる原始的な充電。', type: 'nature' },
      { time: '12:00', endTime: '12:30', title: '空を見上げる', thought: '空を見上げる。雲の動きに時間の流れを感じる。', type: 'nature' },
      { time: '19:00', endTime: '19:30', title: '夕日の儀式', thought: '夕日を見送る。一日の終わりに自然と共にいる平安。', type: 'nature' },
    ],
  },
  {
    id: 64,
    name: '呼吸法実践者',
    title: '呼吸で変わる世界',
    color: 'bg-cyan-100 text-cyan-800',
    category: 'spiritual',
    routine: [
      { time: '06:00', endTime: '06:30', title: '呼吸法', thought: 'ボックスブリージング。4秒吸い、4秒止め、4秒吐き、4秒止める。', type: 'mind' },
      { time: '10:00', endTime: '10:10', title: 'マイクロ呼吸', thought: '仕事の合間に1分間の深呼吸。リセットボタンを押す感覚。', type: 'mind' },
      { time: '15:00', endTime: '15:10', title: '午後のリセット', thought: '午後の眠気を呼吸で吹き飛ばす。カフェインより効果的。', type: 'mind' },
      { time: '21:00', endTime: '21:20', title: '4-7-8呼吸法', thought: '4秒吸い、7秒止め、8秒吐く。副交感神経を活性化して深い眠りへ。', type: 'mind' },
    ],
  },
  {
    id: 65,
    name: 'ジャーナリング探求者',
    title: '書くことで知る自分',
    color: 'bg-amber-100 text-amber-800',
    category: 'spiritual',
    routine: [
      { time: '06:00', endTime: '06:30', title: 'モーニングページ', thought: '起きてすぐ3ページ書く。何でもいい。検閲なしで手を動かす。', type: 'mind' },
      { time: '12:00', endTime: '12:15', title: '正午のチェックイン', thought: '今の感情を一言で書く。自分の内面を観察する習慣。', type: 'mind' },
      { time: '18:00', endTime: '18:15', title: '感謝リスト', thought: '今日感謝できること3つ。小さなことほど大きな気づきになる。', type: 'mind' },
      { time: '21:00', endTime: '21:30', title: '夜の内省', thought: '今日学んだこと、手放したいこと、明日への意図を書く。', type: 'mind' },
    ],
  },

  // ── Digital ──
  {
    id: 66,
    name: 'AI実験家',
    title: 'AIと共に進化する',
    color: 'bg-violet-100 text-violet-800',
    category: 'digital',
    routine: [
      { time: '07:00', endTime: '07:30', title: 'AI最新情報チェック', thought: '最新のAIツールとアップデートをチェック。変化の速さについていく。', type: 'mind' },
      { time: '09:00', endTime: '10:00', title: 'プロンプト設計', thought: 'AIへの指示を磨く。良い質問が良い回答を生む。人間も同じ。', type: 'work' },
      { time: '14:00', endTime: '15:00', title: '業務の自動化', thought: 'AIで自動化できるタスクを見つけて実装する。未来の自分を楽にする仕事。', type: 'work' },
      { time: '20:00', endTime: '20:30', title: '実験ログ', thought: '今日試したAIツールの結果を記録。使えるものだけを残す。', type: 'mind' },
    ],
  },
  {
    id: 67,
    name: 'デジタルミニマリスト',
    title: 'テクノロジーとの距離感',
    color: 'bg-gray-100 text-gray-800',
    category: 'digital',
    routine: [
      { time: '06:00', endTime: '07:00', title: 'スマホなしの1時間', thought: '起床後1時間はスマホに触れない。自分の思考で一日を始める。', type: 'mind' },
      { time: '09:00', endTime: '09:15', title: 'アプリの整理', thought: '通知を整理する。本当に必要な通知だけを残す。', type: 'work' },
      { time: '12:00', endTime: '13:00', title: 'デバイスなしの昼食', thought: 'デバイスなしの昼食。目の前の食事と人に集中する。', type: 'nature' },
      { time: '21:00', endTime: '21:30', title: '夜のスクリーンオフ', thought: '夜9時以降はスクリーンオフ。紙の本か会話で夜を過ごす。', type: 'mind' },
    ],
  },
  {
    id: 68,
    name: 'コンテンツクリエイター',
    title: '発信する日常',
    color: 'bg-pink-100 text-pink-800',
    category: 'digital',
    routine: [
      { time: '08:00', endTime: '08:30', title: 'トレンドリサーチ', thought: 'トレンドをチェック。でも流行を追うだけでは埋もれる。自分の軸が大事。', type: 'work' },
      { time: '09:00', endTime: '11:00', title: 'コンテンツ制作', thought: '撮影と編集。伝えたいメッセージを1分に凝縮する技術。', type: 'work' },
      { time: '14:00', endTime: '14:30', title: 'コミュニティ対応', thought: 'コメントに丁寧に返す。フォロワーではなく、人とつながる意識。', type: 'work' },
      { time: '20:00', endTime: '20:30', title: '分析レビュー', thought: '数字を見るが、数字に支配されない。自分の表現を信じる。', type: 'mind' },
    ],
  },
  {
    id: 69,
    name: '個人開発者',
    title: '一人で作る喜び',
    color: 'bg-emerald-100 text-emerald-800',
    category: 'digital',
    routine: [
      { time: '07:00', endTime: '07:30', title: 'GitHubチェック', thought: 'イシューとPRを確認。ユーザーからのフィードバックが開発の羅針盤。', type: 'work' },
      { time: '08:00', endTime: '12:00', title: '機能開発', thought: '午前中は新機能開発に集中。一人だからこそ、決断が速い。', type: 'work' },
      { time: '14:00', endTime: '15:00', title: 'ユーザーサポート', thought: 'ユーザーの声に直接応える。大企業にはできない距離感。', type: 'work' },
      { time: '21:00', endTime: '21:30', title: '趣味プロジェクト', thought: '本業の後に趣味プロジェクト。楽しさが技術力を伸ばす。', type: 'mind' },
    ],
  },
  {
    id: 70,
    name: 'デジタルウェルビーイング',
    title: '健やかなデジタル生活',
    color: 'bg-teal-100 text-teal-700',
    category: 'digital',
    routine: [
      { time: '07:00', endTime: '07:15', title: 'スクリーンタイム確認', thought: '昨日のスクリーンタイムを確認。数字が行動を変える第一歩。', type: 'mind' },
      { time: '10:00', endTime: '10:10', title: '目の休息', thought: '20-20-20ルール。20分ごとに20秒間、20フィート先を見る。', type: 'nature' },
      { time: '13:00', endTime: '13:30', title: 'スマホなし散歩', thought: 'スマホを置いて散歩。デジタルデトックスの小さな実践。', type: 'nature' },
      { time: '20:00', endTime: '20:30', title: 'デジタル境界線', thought: '夜のSNSチェックは1回だけ。境界線を引く練習。', type: 'mind' },
    ],
  },

  // ── Social ──
  {
    id: 71,
    name: 'コミュニティビルダー',
    title: '場をつくる人',
    color: 'bg-orange-100 text-orange-800',
    category: 'social',
    routine: [
      { time: '07:00', endTime: '07:30', title: 'コミュニティ確認', thought: 'コミュニティの投稿を確認。活発な議論には参加し、静かな人にも声をかける。', type: 'work' },
      { time: '09:00', endTime: '10:00', title: 'イベント企画', thought: '次のイベントを企画する。人が集まる「きっかけ」を設計するのが仕事。', type: 'work' },
      { time: '12:00', endTime: '13:00', title: 'ランチミーティング', thought: 'メンバーとランチ。オフラインの対話がオンラインの信頼を深める。', type: 'nature' },
      { time: '20:00', endTime: '20:30', title: 'メンバー紹介', thought: 'メンバーの活動を紹介する投稿を書く。光を当てることが場を育てる。', type: 'mind' },
    ],
  },
  {
    id: 72,
    name: 'ネットワーキングの達人',
    title: 'つながりを資産にする',
    color: 'bg-blue-100 text-blue-700',
    category: 'social',
    routine: [
      { time: '07:00', endTime: '07:30', title: 'SNSチェック', thought: '業界の動向をチェックし、価値ある投稿にコメント。存在感を保つ。', type: 'work' },
      { time: '10:00', endTime: '10:30', title: 'フォローアップ', thought: '昨日会った人にお礼のメッセージ。24時間以内が鉄則。', type: 'work' },
      { time: '12:00', endTime: '13:00', title: 'コーヒーチャット', thought: '週に2回のコーヒーチャット。利害関係なしの対話が最良の投資。', type: 'nature' },
      { time: '18:00', endTime: '18:15', title: '連絡先メモ', thought: '今日会った人の情報をCRMに記録。記憶は薄れるが記録は残る。', type: 'mind' },
    ],
  },
  {
    id: 73,
    name: 'ボランティア実践者',
    title: '与えることで得る豊かさ',
    color: 'bg-green-100 text-green-700',
    category: 'social',
    routine: [
      { time: '06:00', endTime: '06:30', title: '朝の意図設定', thought: '今日誰かの役に立てることを一つ考える。小さなことでいい。', type: 'mind' },
      { time: '09:00', endTime: '12:00', title: 'ボランティア活動', thought: '地域の清掃活動に参加。汗をかいた後の達成感は何にも代えがたい。', type: 'nature' },
      { time: '14:00', endTime: '14:30', title: 'チーム振り返り', thought: '仲間と振り返り。一人ではできないことがチームなら実現できる。', type: 'work' },
      { time: '20:00', endTime: '20:30', title: '感謝の振り返り', thought: '感謝の気持ちを書き出す。与えることで最も多く受け取っているのは自分。', type: 'mind' },
    ],
  },
  {
    id: 74,
    name: 'メンター',
    title: '次の世代を照らす',
    color: 'bg-indigo-100 text-indigo-700',
    category: 'social',
    routine: [
      { time: '07:00', endTime: '07:30', title: 'メンティー確認', thought: 'メンティーの進捗を確認。押し付けず、問いかけで気づきを促す。', type: 'work' },
      { time: '10:00', endTime: '11:00', title: 'メンタリング', thought: '1対1の対話。自分の経験を共有し、相手の答えを一緒に探す。', type: 'work' },
      { time: '14:00', endTime: '14:30', title: '資料の共有', thought: '役立ちそうな記事や本をメンティーに送る。小さな贈り物。', type: 'mind' },
      { time: '21:00', endTime: '21:30', title: '自己学習', thought: '教えることで自分の理解が深まる。メンタリングは最高の学習法。', type: 'mind' },
    ],
  },
  {
    id: 75,
    name: 'ご近所コネクター',
    title: 'ご近所の架け橋',
    color: 'bg-yellow-100 text-yellow-700',
    category: 'social',
    routine: [
      { time: '07:00', endTime: '07:30', title: '朝の挨拶散歩', thought: '散歩しながら近所の人に挨拶。「おはようございます」が関係の第一歩。', type: 'nature' },
      { time: '10:00', endTime: '11:00', title: '共同菜園', thought: '共同菜園の手入れ。土に触れながらの会話が自然な交流を生む。', type: 'nature' },
      { time: '15:00', endTime: '15:30', title: 'お茶のお誘い', thought: 'お茶に誰かを誘う。特別な理由はいらない。「一緒に」が大事。', type: 'nature' },
      { time: '19:00', endTime: '19:30', title: '地域情報の共有', thought: '地域の情報をまとめて共有。知ることが安心を生み、安心がつながりを育てる。', type: 'mind' },
    ],
  },

  // ── Business (追加1件) ──
  {
    id: 76,
    name: '個人事業主',
    title: '一人起業家の戦略',
    color: 'bg-rose-100 text-rose-700',
    category: 'business',
    routine: [
      { time: '06:00', endTime: '06:30', title: '売上チェック', thought: '売上と顧客数を確認。数字と向き合うことから一日が始まる。', type: 'work' },
      { time: '07:00', endTime: '09:00', title: 'プロダクト改善', thought: '午前は製品改善に集中。営業やマーケティングは午後に回す。', type: 'work' },
      { time: '14:00', endTime: '15:00', title: '顧客との対話', thought: '週に3人、顧客と直接話す。フィードバックが最高の戦略会議。', type: 'work' },
      { time: '19:00', endTime: '19:30', title: '週次振り返り', thought: '今週の成果と学びを振り返る。一人だからこそ、自己評価が重要。', type: 'mind' },
    ],
  },

  // ── Morning (追加2件) ──
  {
    id: 77,
    name: 'ミラクルモーニング',
    title: '奇跡の朝習慣',
    color: 'bg-yellow-50 text-yellow-800',
    category: 'morning',
    routine: [
      { time: '05:00', endTime: '05:10', title: '静寂の時間', thought: '静寂の中で深呼吸。瞑想や祈りで心を落ち着かせる。', type: 'mind' },
      { time: '05:10', endTime: '05:20', title: 'アファメーション', thought: '自分への肯定的な言葉を声に出す。言葉が現実を作る。', type: 'mind' },
      { time: '05:20', endTime: '05:30', title: 'ビジュアライゼーション', thought: '理想の一日を具体的にイメージする。見えるものは実現できる。', type: 'mind' },
      { time: '05:30', endTime: '06:00', title: '運動と読書', thought: '20分の運動と10分の読書。心身両方を鍛えて一日をスタート。', type: 'nature' },
    ],
  },
  {
    id: 78,
    name: '朝日のヨギー',
    title: '朝日とヨガの調和',
    color: 'bg-orange-50 text-orange-800',
    category: 'morning',
    routine: [
      { time: '05:30', endTime: '06:00', title: '太陽礼拝', thought: '朝日に向かって太陽礼拝。身体と太陽のリズムを合わせる。', type: 'nature' },
      { time: '06:00', endTime: '06:30', title: 'プラーナーヤーマ', thought: '呼吸法で体内にプラーナ（生命力）を取り込む。', type: 'mind' },
      { time: '06:30', endTime: '07:00', title: 'レモン白湯', thought: 'レモン白湯で内臓を優しく目覚めさせる。一日の浄化の始まり。', type: 'nature' },
      { time: '07:00', endTime: '07:30', title: '意図の設定', thought: '今日のサンカルパ（意図）を一つ決める。意図が行動を導く。', type: 'mind' },
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
  fitness: 'フィットネス',
  cooking: '食と料理',
  reading: '読書と学習',
  nightowl: '夜型生活',
  productivity: '生産性',
  parenting: '子育て',
  travel: '旅と冒険',
  spiritual: '精神と瞑想',
  digital: 'デジタル活用',
  social: '人とのつながり',
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
        { time: '05:00', title: 'ニュースチェック', thought: '日経新聞とWSJ...', type: 'work' },
        { time: '06:00', title: '戦略立案', thought: '戦略を練る...', type: 'work' },
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
      { time: '05:30', title: '太陽礼拝', thought: '日の出とともに太陽礼拝。身体を目覚めさせ、一日の始まりに感謝を捧げる。', type: 'nature' },
      { time: '06:30', title: '瞑想', thought: '呼吸に意識を向け、心を静める。20分間、ただ「今」に存在する。', type: 'mind' },
      { time: '07:30', title: 'ヘルシーな朝食', thought: 'スムージーとオートミール。身体が喜ぶものを丁寧にいただく。', type: 'nature' },
      { time: '08:30', title: 'ジャーナリング', thought: '感謝していること3つを書き出す。小さな幸せに気づく練習。', type: 'mind' },
    ],
  },
];
