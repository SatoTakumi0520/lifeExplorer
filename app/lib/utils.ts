export const formatDate = (date: Date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
    dow: days[date.getDay()],
    month: months[date.getMonth()],
    day: date.getDate(),
    full: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
    iso: date.toISOString().split('T')[0],
  };
};

export const getTaskDurationMinutes = (startTime: string, endTime?: string): number => {
  if (!endTime) return 30;
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  return Math.max(endMinutes - startMinutes, 15);
};

export const getTaskHeight = (durationMinutes: number): number => {
  const PIXELS_PER_HOUR = 80;
  const MIN_TASK_HEIGHT = 56;
  const height = (durationMinutes / 60) * PIXELS_PER_HOUR;
  return Math.max(height, MIN_TASK_HEIGHT);
};

export const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};
