<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';

import { useRescheduleStore } from '../store';

import type { AppointmentSlot } from '@/types';

const props = defineProps<{
  appointmentId: string,
}>();

const store = useRescheduleStore();

const {
  initStore,
  fetchAgendaForNext7Days,
  fetchAgendaForPrevious7Days,
  bookSlot,
} = store;

const {
  doctor,
  appointmentBooked,
  rescheduledSlotSelected,
  availableSlots,
  startingDate,
  isFetchingSlots,
  isBookingSlot,
} = storeToRefs(store);

const fetchingError = ref(false);
const bookingError = ref(false);

function selectSlot(slot: AppointmentSlot) {
  rescheduledSlotSelected.value = slot;
}

async function fetchAvailableSlots(when: 'next' | 'previous') {
  const fetchAgenda = when === 'next' ? fetchAgendaForNext7Days : fetchAgendaForPrevious7Days;
  try {
    await fetchAgenda();
  } catch (error) {
    fetchingError.value = true;
  }
}

async function requestSlotBooking(slot: AppointmentSlot) {
  try {
    await bookSlot(slot);
  } catch (error) {
    bookingError.value = true;
  }
}

onBeforeMount(() => {
  // TODO: handle init error. In a larger project this should navigate to error view
  initStore(props.appointmentId);
});
</script>

<template>
  <div class="container">
    <p
      class="font-body text-lg text-doc-blue-800 mb-8"
      v-html="$t('Confirm your appointment with {doctor}', { doctor: `Dr. ${doctor.firstName} ${doctor.lastName}` })"
    />
    <AppointmentPreview
      v-if="appointmentBooked"
      :appointment-booked="appointmentBooked"
      :loading="isBookingSlot"
    />
    <div class="my-8 font-body text-lg text-doc-blue-800">
      <p class="font-bold">
        {{ $t('Did you have an unexpected situation?') }}
      </p>
      <p>
        {{ $t('You can change the appointment for when it suits you better.') }}
      </p>
    </div>
    <AppointmentsCalendar
      :starting-date="startingDate"
      :available-slots="availableSlots"
      :is-fetching-slots="isFetchingSlots"
      :is-fetch-error="fetchingError"
      @slot-selected="selectSlot"
      @previous-week-requested="fetchAvailableSlots('previous')"
      @next-week-requested="fetchAvailableSlots('next')"
    />
    <AppointmentRescheduler
      v-if="!!rescheduledSlotSelected"
      :appointment-selected="rescheduledSlotSelected"
      :loading="isBookingSlot"
      @booking-requested="requestSlotBooking"
      class="my-8"
    />
  </div>
  <VModal
    v-model="bookingError"
    class="text-doc-blue-900"
  >
    <template #content>
      <div class="flex justify-center items-center">
        <p class="font-bofy font-normal text-doc-blue-900 text-lg">
          {{ $t('An error occurred while booking your appointment.') }}
        </p>
      </div>
    </template>
    <template #actions="{ close }">
      <button
        class="bg-transparent text-state-error-500 border border-state-error-500 font-body font-semibold px-4 py-2 rounded-md hover:bg-state-error-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-state-error-500 focus:ring-opacity-50 transition-colors duration-300 ease-in-out"
        @click="close"
      >
        {{ $t('Please try again') }}
      </button>
    </template>
  </VModal>
</template>
