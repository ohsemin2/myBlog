const koreanDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Seoul",
});

export function formatKoreanDate(date: string | number | Date) {
  return koreanDateFormatter.format(new Date(date));
}
