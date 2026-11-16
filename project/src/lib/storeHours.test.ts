import { describe, expect, it } from 'vitest';
import { storeStatus } from './storeHours';

// Maputo is UTC+2 all year, so 08:00 there is 06:00 UTC.
const maputo = (iso: string) => new Date(`${iso}+02:00`);

describe('storeStatus', () => {
  it('is open during the day on a weekday', () => {
    expect(storeStatus(maputo('2026-11-16T10:30:00'))).toEqual({ open: true, label: 'Aberto agora, até às 18h' });
  });

  it('opens later the same day before 8h', () => {
    expect(storeStatus(maputo('2026-11-16T07:15:00')).label).toBe('Fechado, abre hoje às 8h');
  });

  it('opens tomorrow after closing on a weekday', () => {
    expect(storeStatus(maputo('2026-11-16T18:00:00')).label).toBe('Fechado, abre amanhã às 8h');
  });

  it('opens on Monday after closing on a Saturday', () => {
    expect(storeStatus(maputo('2026-11-21T19:00:00')).label).toBe('Fechado, abre segunda às 8h');
  });

  it('opens tomorrow on a Sunday', () => {
    expect(storeStatus(maputo('2026-11-15T12:00:00'))).toEqual({ open: false, label: 'Fechado, abre amanhã às 8h' });
  });

  it('uses Maputo time whatever the clock of the visitor', () => {
    // 05:30 UTC on a Monday is 07:30 in Maputo: not open yet.
    expect(storeStatus(new Date('2026-11-16T05:30:00Z')).label).toBe('Fechado, abre hoje às 8h');
  });
});
