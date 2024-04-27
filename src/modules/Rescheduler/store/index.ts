import { ref } from 'vue';
import type { Ref } from 'vue';
import { defineStore } from 'pinia';

import {
  availableSlotsEndpoint,
  // bookSlotEndpoint,
} from '../api';

import { apiRequest, getApiRoute, PayloadFromServer } from '@/utils';

import type { AppointmentSlot, Doctor, Patient } from '@/types';

export const useRescheduleStore = defineStore('reschedule', () => {
  const appointmentBooked: Ref<AppointmentSlot> = ref({} as AppointmentSlot);
  const doctor: Ref<Doctor> = ref({} as Doctor);
  const patient: Ref<Patient> = ref({} as Patient);

  const availableSlots = ref<AppointmentSlot[]>([]);

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
          name: 'John',
          secondName: 'Doe',
          email: 'johndoe@email.com',
          phone: '123456789',
        };
        resolve({ appointment: appointmentData, dr: drData, patientData: pData });
      }, 100);
    });
    appointmentBooked.value = appointment;
    doctor.value = dr;
    patient.value = patientData;
  }

  async function fetchAvailableSlots(mondayDate: string) {
    const route = getApiRoute(availableSlotsEndpoint, { mondayDate });
    const response = await apiRequest<AppointmentSlot[]>(route);
    availableSlots.value = PayloadFromServer(response.data);
  }

  // async function bookSlot(slot: AppointmentSlot) {
  //   await apiRequest<void>(bookSlotEndpoint, { requestMethod: 'post', data: slot });
  // }

  return {
    appointmentBooked,
    doctor,
    patient,
    availableSlots,
    getAppointmentDetails,
    fetchAvailableSlots,
    // bookSlot,
  };
});
