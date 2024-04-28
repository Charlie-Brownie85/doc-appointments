<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';

import type { AppointmentSlot } from '@/types';

import { DATE_FORMATS } from '@/config';

const props = withDefaults(defineProps<{
  appointmentSelected: AppointmentSlot,
  loading?: boolean,
}>(), {
  loading: false,
});

const emit = defineEmits(['bookingRequested']);

const formattedDate = computed(() => format(props.appointmentSelected.start, DATE_FORMATS.APPOINTMENT_DATE));
const formattedTime = computed(() => format(props.appointmentSelected.start, DATE_FORMATS.APPOINTMENT_TIME));
</script>

<template>
  <div>
    <div class="mb-8 font-body text-lg text-doc-blue-800">
      <p class="font-bold">
        {{ $t('Reschedule') }}
      </p>
      <p>{{ $t('Click the button to confirm') }}</p>
    </div>
    <button
      type="button"
      class="booking-btn"
      :disabled="loading"
      data-testid="bookingButton"
      @click="emit('bookingRequested', appointmentSelected)"
    >
      <span class="font-body font-medium text-base">{{ $t('{date} at {time}', { date: formattedDate, time: formattedTime }) }}</span>
    </button>
  </div>
</template>

<style lang="postcss" scoped>
.booking-btn {
  @apply w-full p-3 bg-doc-blue-600 text-white rounded-md shadow-sm;
  @apply transition-colors duration-200 ease-in-out;

  &:disabled {
    @apply bg-doc-blue-400 text-base-100 cursor-not-allowed pointer-events-none;
  }

  &:hover:not(:disabled) {
    @apply bg-doc-blue-700;
  }
}
</style>
