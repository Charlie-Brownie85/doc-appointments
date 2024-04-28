<script setup lang="ts">
import { onBeforeMount } from 'vue';
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
} = store;

const {
  doctor,
  appointmentBooked,
  rescheduledSlotSelected,
  availableSlots,
  startingDate,
} = storeToRefs(store);

function selectSlot(slot: AppointmentSlot) {
  rescheduledSlotSelected.value = slot;
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
      @slot-selected="selectSlot"
      @previous-week-requested="fetchAgendaForPrevious7Days"
      @next-week-requested="fetchAgendaForNext7Days"
    />
    <AppointmentRescheduler
      v-if="!!rescheduledSlotSelected"
      :appointment-selected="rescheduledSlotSelected"
      class="my-8"
    />
  </div>
</template>

<style lang="postcss" scoped>

</style>
