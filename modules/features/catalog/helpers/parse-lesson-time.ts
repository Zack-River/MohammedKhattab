
export function parseLessonTime(value: string) {
  if (!/^\d+:\d{2}$/.test(value))
    throw new Error(`Invalid lesson duration: ${value}`);
  const [minutes, seconds] = value.split(":").map(Number);
  if (seconds > 59) throw new Error(`Invalid lesson seconds: ${value}`);
  return minutes * 60 + seconds;
}
