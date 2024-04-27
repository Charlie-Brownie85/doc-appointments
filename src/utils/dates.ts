import {
  nextMonday as getNextMonday,
  previousMonday,
} from 'date-fns';

import type { AppointmentSlot, AgendaDay } from '@/types';

export function getMondays(date: Date): Date[] {
  if (date.getDay() === 1) {
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
