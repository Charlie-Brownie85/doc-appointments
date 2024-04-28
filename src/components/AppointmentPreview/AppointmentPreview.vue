<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';

import type { AppointmentSlot } from '@/types';

import { DATE_FORMATS } from '@/config';

const props = withDefaults(defineProps<{
  appointmentBooked: AppointmentSlot,
  loading?: boolean,
}>(), {
  loading: false,
});

const formattedDate = computed(() => (props.appointmentBooked?.start
  ? format(props.appointmentBooked.start, DATE_FORMATS.APPOINTMENT_DATE)
  : ''));
const formattedTime = computed(() => (props.appointmentBooked?.start
  ? format(props.appointmentBooked?.start, DATE_FORMATS.APPOINTMENT_TIME)
  : ''));
</script>

<template>
  <div class="w-full p-4 bg-base-100 rounded-md shadow-sm mb-4">
    <div class="flex items-center justify-start gap-3">
      <div class="flex items-center space-x-4">
        <span
          v-if="loading"
          class="block loader text-doc-teal-300 w-5 h-5"
          data-testid="loader"
        />
        <SVGIcon
          v-else
          name="calendar"
          color="currentColor"
          class="text-base-500 w-5 h-5"
        />
        <p class="font-body text-base text-doc-blue-800 font-medium relative">
          {{ $t('On {date} at {time}', { date: formattedDate, time: formattedTime }) }}
          <span
            v-if="loading"
            class="absolute left-0 top-1/2 h-[1px] w-full bg-doc-blue-800"
            data-testid="strokeThrough"
          />
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
