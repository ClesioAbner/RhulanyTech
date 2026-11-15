// The shop opens Monday to Saturday, 8h to 18h, Maputo time (see STORE.hours).
const OPEN = 8;
const CLOSE = 18;
const OPEN_DAYS = [1, 2, 3, 4, 5, 6]; // Monday … Saturday (Sunday is 0)
const DAY_NAMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** The day of the week and the time in Maputo, wherever the visitor is. */
const maputoNow = (now: Date) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Maputo',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return { day: WEEKDAYS.indexOf(part('weekday')), hour: Number(part('hour')) + Number(part('minute')) / 60 };
};

/** Whether the shop is open now, and a short line saying so: "Aberto agora, até às 18h". */
export const storeStatus = (now = new Date()) => {
  const { day, hour } = maputoNow(now);
  const openToday = OPEN_DAYS.includes(day);
  if (openToday && hour >= OPEN && hour < CLOSE) return { open: true, label: `Aberto agora, até às ${CLOSE}h` };
  if (openToday && hour < OPEN) return { open: false, label: `Fechado, abre hoje às ${OPEN}h` };
  // After closing, or on a Sunday: the next day it opens.
  let next = (day + 1) % 7;
  while (!OPEN_DAYS.includes(next)) next = (next + 1) % 7;
  const when = next === (day + 1) % 7 ? 'amanhã' : DAY_NAMES[next];
  return { open: false, label: `Fechado, abre ${when} às ${OPEN}h` };
};
