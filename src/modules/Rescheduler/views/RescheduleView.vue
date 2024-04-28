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

onBeforeMount(() => {
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
      @booking-requested="bookSlot"
      class="my-8"
    />
  </div>
</template>

<style lang="postcss" scoped>

</style>
