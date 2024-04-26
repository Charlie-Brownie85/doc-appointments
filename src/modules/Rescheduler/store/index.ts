import { ref } from 'vue';
import { defineStore } from 'pinia';

import { availableSlotsEndpoint, bookSlotEndpoint } from '../api';

import { apiRequest, getApiRoute } from '@/utils';

import type { AppointmentSlot } from '@/types';

export const useReschedulerStore = defineStore('rescheduler', () => {
  const availableSlots = ref<AppointmentSlot[]>([]);

  async function fetchAvailableSlots(mondayDate: string) {
    const route = getApiRoute(availableSlotsEndpoint, { mondayDate });
    const response = await apiRequest<AppointmentSlot[]>(route);
    availableSlots.value = response.data;
  }

  async function bookSlot(slot: AppointmentSlot) {
    await apiRequest<void>(bookSlotEndpoint, { requestMethod: 'post', data: slot });
  }

  return {
    availableSlots,
    fetchAvailableSlots,
    bookSlot,
  };
});
