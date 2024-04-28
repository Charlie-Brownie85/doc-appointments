<script setup lang="ts">
import { format } from 'date-fns';

import type { AppointmentSlot } from '@/types';

import { DATE_FORMATS } from '@/config';

const props = withDefaults(defineProps<{
  appointmentSlot: AppointmentSlot,
  isSelected?: boolean,
}>(), {
  isSelected: false,
});

const emit = defineEmits(['slotSelected']);

function selectSlot() {
  if (props.appointmentSlot.taken || props.isSelected) return;
  emit('slotSelected', props.appointmentSlot);
}
</script>

<template>
  <div
    class="appointment-time-slot"
    :class="{
      'appointment-time-slot--taken': appointmentSlot?.taken,
      'appointment-time-slot--selected': isSelected && !appointmentSlot?.taken,
    }"
    data-testid="appointment-time-slot"
    @click="selectSlot"
  >
    <span>{{ format(appointmentSlot.start, DATE_FORMATS.APPOINTMENT_TIME) }}</span>
  </div>
</template>

<style lang="postcss" scoped>
.appointment-time-slot {
  @apply px-4 py-1 flex justify-center items-center border-2 border-transparent bg-doc-blue-200 cursor-pointer rounded-md;
  transition: border-color 0.3s ease;

  &:hover:not(.appointment-slot--taken) {
    @apply border-doc-blue-600;
  }

  span {
    @apply font-body font-medium text-doc-blue-600 select-none;
  }

  &--taken {
    @apply bg-transparent cursor-not-allowed pointer-events-none;

    span {
      @apply text-base-400 line-through;
    }
  }

  &--selected {
    @apply bg-doc-blue-600;

    span {
      @apply text-white;
    }
  }
}
</style>
