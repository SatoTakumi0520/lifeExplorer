export type Screen = 'TOP' | 'HOME' | 'EDIT' | 'EXPLORE' | 'OTHER_HOME' | 'PROFILE' | 'BORROW' | 'SETTINGS' | 'ONBOARDING' | 'CALENDAR';

export type PersonaCategory =
  | 'morning' | 'wellness' | 'business' | 'creative' | 'minimalist' | 'student'
  | 'fitness' | 'cooking' | 'reading' | 'nightowl' | 'productivity'
  | 'parenting' | 'travel' | 'spiritual' | 'digital' | 'social'
  | 'custom';

export type OnboardingPreferences = {
  completed: boolean;
  selectedCategories: PersonaCategory[];
  lifestyleRhythm: 'morning' | 'night' | 'balanced' | null;
  prefecture: string | null; // 例: '東京都' | '大阪府' | null(未設定)
};

/**
 * タスクの分類。「その時間で何が起きるか」を単一軸とした 6 カテゴリ MECE。
 *
 *  - work    働く     経済義務として外界に出す(本業/副業/業務)
 *  - create  創る     自発的に外界に出す(創作/発信/ボランティア)
 *  - study   学ぶ     外から取り込む(勉強/読書/講座)
 *  - care    整える   自分を保つ(食事/睡眠/運動/瞑想/家事)
 *  - enjoy   楽しむ   一人で解放する(趣味/エンタメ/ぼんやり)
 *  - connect つながる 他者と共有する(家族/友人/コミュニティ)
 *
 * 旧型 ('nature' | 'mind') は後方互換のため受理し、内部で
 *  nature → enjoy / mind → study に正規化する(useRoutine 等)。
 */
export type RoutineType = 'work' | 'create' | 'study' | 'care' | 'enjoy' | 'connect';

export type ScheduleType = 'weekday' | 'weekend';

export type RoutineTask = {
  id?: string | number;
  time: string;
  endTime?: string;
  title: string;
  thought: string;
  type: RoutineType;
  isOther?: boolean;
  url?: string;
};

export type PersonaTemplate = {
  id: number | string;
  name: string;
  title: string;
  color: string;
  category?: PersonaCategory;
  routine: RoutineTask[];
};

export type SocialPost = {
  id: number | string;
  user: string;
  role?: string;
  title: string;
  likes: number;
  avatar: string;
  routine: RoutineTask[];
};

export type ScheduledEvent = {
  id: string;
  title: string;
  date: string;          // 'YYYY-MM-DD'
  time: string;          // 'HH:mm'
  endTime?: string;
  location?: string;
  url?: string;
  category?: string;
  source?: string;       // 'doorkeeper' | 'curated'
  thought?: string;
  type: RoutineType;     // タイムライン表示用の色分け
};

export type RoutineComment = {
  id: string;
  routineId: string;
  userId: string;
  displayName: string;
  body: string;
  createdAt: string;
};
