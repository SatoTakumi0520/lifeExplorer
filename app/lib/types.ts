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
};

export type RoutineType = 'nature' | 'mind' | 'work';

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
