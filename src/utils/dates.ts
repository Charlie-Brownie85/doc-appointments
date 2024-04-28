import {
  nextMonday as getNextMonday,
  previousMonday,
  isMonday,
  format,
  isValid,
} from 'date-fns';

import type { AppointmentSlot, AgendaDay } from '@/types';

export function getMondays(date: Date): Date[] {
  if (isMonday(date)) {
    return [date];
  }
  const pastMonday = previousMonday(date);
  const nextMonday = getNextMonday(date);
  return [pastMonday, nextMonday];
}

export function groupAppointmentsByDate(appointments: AppointmentSlot[]): AgendaDay[] {
  const dateIndices: { [date: string]: number } = {};
  return appointments.reduce((acc, appointment) => {
    const date = new Date(appointment.start);
    const dayString = date.toDateString();

    if (dayString in dateIndices) {
      (acc[dateIndices[dayString]] as AgendaDay).availableSlots.push(appointment);
    } else {
      dateIndices[dayString] = acc.length;
      acc.push({
        date,
        availableSlots: [appointment],
      });
    }
    return acc;
  }, [] as AgendaDay[]);
}

export function formatDateForApi(date: Date | string): string {
  if (!isValid(new Date(date))) {
    throw new Error('Invalid date provided');
  }

  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
}
