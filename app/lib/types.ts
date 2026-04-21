export type Screen = 'TOP' | 'HOME' | 'EDIT' | 'EXPLORE' | 'OTHER_HOME' | 'PROFILE' | 'BORROW' | 'SETTINGS' | 'ONBOARDING';

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

export type RoutineType = 'nature' | 'mind' | 'work';

export type ScheduleType = 'weekday' | 'weekend';

export type RoutineTask = {
  id?: string | number;
  time: string;
  endTime?: string;
  title: string;
  thought: string;
  type: RoutineType;
  isOther?: boolean;
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

export type RoutineComment = {
  id: string;
  routineId: string;
  userId: string;
  displayName: string;
  body: string;
  createdAt: string;
};
