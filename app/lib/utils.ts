export const formatDate = (date: Date) => {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const month = date.getMonth() + 1;
  return {
    dow: days[date.getDay()] + '曜日',
    month: `${month}月`,
    day: `${date.getDate()}日`,
    full: `${date.getFullYear()}年${month}月${date.getDate()}日`,
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
