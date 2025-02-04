import { ref } from 'vue';
import type { Ref } from 'vue';
import { defineStore } from 'pinia';

import {
  format,
  isSameDay,
  differenceInDays,
  isAfter,
  addDays,
  subDays,
} from 'date-fns';

import {
  availableSlotsEndpoint,
  bookSlotEndpoint,
} from '../api';

import { DATE_FORMATS } from '@/config';

import {
  apiRequest,
  getApiRoute,
  PayloadFromServer,
  PayloadToServer,
  getMondays,
  groupAppointmentsByDate,
  formatDateForApi,
} from '@/utils';

import type {
  AppointmentSlot,
  Doctor,
  Patient,
  AgendaDay,
} from '@/types';

export const useRescheduleStore = defineStore('reschedule', () => {
  const appointmentBooked: Ref<AppointmentSlot> = ref({} as AppointmentSlot);
  const doctor: Ref<Doctor> = ref({} as Doctor);
  const patient: Ref<Patient> = ref({} as Patient);

  const startingDate = ref(new Date());
  const rescheduledSlotSelected: Ref<AppointmentSlot | null> = ref(null);

  const isBookingSlot = ref(false);
  const isFetchingSlots = ref(false);

  const availableSlots = ref<AgendaDay[]>([]);

  /**
  * This function should be in charge of retrieving the current
  * appointment info to be rescheduled, including the patient data, doctor
  * and time slot booked.
  */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function getAppointmentDetails(appointmentId: string) {
    const { appointment, dr, patientData } = await new Promise<{ appointment: AppointmentSlot, dr: Doctor, patientData: Patient }>((resolve) => {
      setTimeout(() => {
        const appointmentData: AppointmentSlot = {
          start: '2024-05-24T10:30:00',
          end: '2024-05-24T10:40:00',
        };
        const drData: Doctor = {
          id: 1,
          firstName: 'Simeon',
          lastName: 'Molas',
        };
        const pData: Patient = {
          name: 'Rick',
          secondName: 'Sanchez',
          email: 'ricksanchez@email.com',
          phone: '+123456789',
        };
        resolve({ appointment: appointmentData, dr: drData, patientData: pData });
      }, 100);
    });
    appointmentBooked.value = appointment;
    doctor.value = dr;
    patient.value = patientData;
  }

  async function fetchAvailableSlots(mondayDate: string): Promise<AgendaDay[]> {
    isFetchingSlots.value = true;
    const route = getApiRoute(availableSlotsEndpoint, { mondayDate });
    try {
      const response = await apiRequest<AppointmentSlot[]>(route);
      return groupAppointmentsByDate(PayloadFromServer(response.data));
    } finally {
      isFetchingSlots.value = false;
    }
  }

  async function fetch7DaysAgenda(date: Date): Promise<AgendaDay[]> {
    const mondays = getMondays(date);
    const agendaDays = (await Promise.all(mondays.map((monday: Date) => fetchAvailableSlots(format(monday, DATE_FORMATS.SLOTS_REQUEST))))).flat();
    // filter out days prior to "date" param and also days further than 7 days from "date" param
    const filteredAgendaDays = agendaDays.filter((agendaDay) => {
      const daysDifference = differenceInDays(agendaDay.date, date);
      return isAfter(agendaDay.date, date) && daysDifference < 7 && !isSameDay(agendaDay.date, date);
    });
    return filteredAgendaDays;
  }

  async function fetchAgendaForNext7Days() {
    startingDate.value = addDays(startingDate.value, 7);
    availableSlots.value = await fetch7DaysAgenda(startingDate.value);
  }

  async function fetchAgendaForPrevious7Days() {
    startingDate.value = subDays(startingDate.value, 7);
    availableSlots.value = await fetch7DaysAgenda(startingDate.value);
  }

  async function initStore(appointmentId: string) {
    await getAppointmentDetails(appointmentId);
    availableSlots.value = await fetch7DaysAgenda(startingDate.value);
  }

  async function bookSlot(slot: AppointmentSlot) {
    isBookingSlot.value = true;

    const payload = PayloadToServer({
      start: formatDateForApi(slot.start),
      end: formatDateForApi(slot.end),
      comments: 'Rescheduled appointment',
      patient: {
        name: patient.value.name,
        secondName: patient.value.secondName,
        email: patient.value.email,
        phone: patient.value.phone,
      },
    });

    try {
      await apiRequest<void>(bookSlotEndpoint, { requestMethod: 'post', data: payload });
      availableSlots.value = await fetch7DaysAgenda(startingDate.value); // refetch data to update it
    } finally {
      rescheduledSlotSelected.value = null;
      isBookingSlot.value = false;
    }
  }

  return {
    appointmentBooked,
    rescheduledSlotSelected,
    doctor,
    patient, // exposed for testing purposes
    availableSlots,
    fetchAvailableSlots, // exposed for testing purposes
    getAppointmentDetails,
    initStore,
    startingDate,
    fetch7DaysAgenda, // exposed for testing purposes
    fetchAgendaForNext7Days,
    fetchAgendaForPrevious7Days,
    bookSlot,
    isBookingSlot,
    isFetchingSlots,
  };
});
