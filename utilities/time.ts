type MillisToMinutesAndSeconds = (mills: number) => string;

export const millisToMinutesAndSeconds: MillisToMinutesAndSeconds = (mills) => {
  const minutes = Math.floor(mills / 60000);
  const seconds = Number(((mills % 60000) / 1000).toFixed(0));

  return seconds == 60
    ? String(minutes + 1) + ':00'
    : minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};
