import { ref } from 'vue';
import type { Ref } from 'vue';
import { defineStore } from 'pinia';

import { availableSlotsEndpoint, bookSlotEndpoint } from '../api';

import { apiRequest, getApiRoute } from '@/utils';

import type { AppointmentSlot, Doctor } from '@/types';

export const useRescheduleStore = defineStore('reschedule', () => {
  const appointmentBooked: Ref<AppointmentSlot> = ref({} as AppointmentSlot);
  const doctor: Ref<Doctor> = ref({} as Doctor);

  const availableSlots = ref<AppointmentSlot[]>([]);

  /**
  * This function should be in charge of retrieving the current
  * appointment info to be rescheduled, including the doctor and
  * the time slot booked.
  */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function getAppointmentDetails(appointmentId: string) {
    const { appointment, dr } = await new Promise<{ appointment: AppointmentSlot; dr: Doctor }>((resolve) => {
      setTimeout(() => {
        const appointmentData: AppointmentSlot = {
          Start: '2024-05-24T10:30:00',
          End: '2024-05-24T11:40:00',
        };
        const drData: Doctor = {
          id: 1,
          firstName: 'Simeon',
          lastName: 'Molas',
        };
        resolve({ appointment: appointmentData, dr: drData });
      }, 100);
    });
    appointmentBooked.value = appointment;
    doctor.value = dr;
  }

  async function fetchAvailableSlots(mondayDate: string) {
    const route = getApiRoute(availableSlotsEndpoint, { mondayDate });
    const response = await apiRequest<AppointmentSlot[]>(route);
    availableSlots.value = response.data;
  }

  async function bookSlot(slot: AppointmentSlot) {
    await apiRequest<void>(bookSlotEndpoint, { requestMethod: 'post', data: slot });
  }

  return {
    appointmentBooked,
    doctor,
    availableSlots,
    getAppointmentDetails,
    fetchAvailableSlots,
    bookSlot,
  };
});
