export type Screen = 'TOP' | 'HOME' | 'EDIT' | 'SOCIAL' | 'OTHER_HOME' | 'PROFILE' | 'BORROW' | 'SETTINGS';

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
