import { getMondays, groupAppointmentsByDate, formatDateForApi } from './dates';

import type { AppointmentSlot } from '@/types';

describe('dates utils', () => {
  it('"getMondays" should return an array with the previous and next monday for a given date', () => {
    const date = new Date('2024-05-24T10:30:00');

    const result = getMondays(date);

    expect(result).toEqual([
      new Date('2024-05-20T10:30:00'),
      new Date('2024-05-27T10:30:00'),
    ]);
  });

  it('"getMondays" should return an array with a single monday if given date is already a Monday', () => {
    const date = new Date('2024-05-06T10:30:00');

    const result = getMondays(date);

    expect(result).toEqual([new Date('2024-05-06T10:30:00')]);
  });

  it('"groupAppointmentsByDate" should return an array of objects with the appointments grouped by date', () => {
    const appointments: AppointmentSlot[] = [
      {
        start: '2024-05-24T10:30:00',
        end: '2024-05-24T11:30:00',
      },
      {
        start: '2024-05-24T12:30:00',
        end: '2024-05-24T13:30:00',
      },
      {
        start: '2024-05-25T10:30:00',
        end: '2024-05-25T11:30:00',
      },
    ];

    const result = groupAppointmentsByDate(appointments);

    expect(result).toEqual([
      {
        date: new Date('2024-05-24T10:30:00'),
        availableSlots: [
          {
            start: '2024-05-24T10:30:00',
            end: '2024-05-24T11:30:00',
          },
          {
            start: '2024-05-24T12:30:00',
            end: '2024-05-24T13:30:00',
          },
        ],
      },
      {
        date: new Date('2024-05-25T10:30:00'),
        availableSlots: [
          {
            start: '2024-05-25T10:30:00',
            end: '2024-05-25T11:30:00',
          },
        ],
      },
    ]);
  });

  it('"formatDateForApi" should return a string with the date formatted as "yyyy-MM-dd HH:mm:ss"', () => {
    const date = new Date('2024-05-24T10:30:00');

    const result = formatDateForApi(date);

    expect(result).toBe('2024-05-24 10:30:00');
  });
});
