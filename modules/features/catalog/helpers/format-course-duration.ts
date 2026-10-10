
export function formatCourseDuration(seconds: number) {
  const minutes = Math.round(seconds / 60),
    hours = Math.floor(minutes / 60),
    rest = minutes % 60;
  const arabic = (value: number) =>
    String(value).replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]);
  const hour =
    hours === 1 ? "ساعة" : hours === 2 ? "ساعتان" : `${arabic(hours)} ساعات`;
  const minute = `${arabic(rest || minutes)} ${(rest || minutes) >= 3 && (rest || minutes) <= 10 ? "دقائق" : "دقيقة"}`;
  return hours ? (rest ? `${hour} و${minute}` : hour) : minute;
}
