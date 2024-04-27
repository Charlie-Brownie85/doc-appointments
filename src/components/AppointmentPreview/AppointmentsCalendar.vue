<script setup lang="ts">
import { computed } from 'vue';

import {
  isToday,
  isTomorrow,
  addDays,
  isSameDay,
  format as formatDFNS,
} from 'date-fns';

import i18n from '@/i18n';

import type { AppointmentSlot, AgendaDay } from '@/types';

export interface Props {
  startingDate: Date,
  availableSlots: AgendaDay[],
}

const props = defineProps<Props>();

const emit = defineEmits(['slotSelected', 'previousWeekRequested', 'nextWeekRequested']);

const { t } = i18n.global;

const days = computed(() => Array.from({ length: 7 }, (_, i) => addDays(props.startingDate, i)));

const isPrevDisabled = computed(() => isToday(props.startingDate));

function formatWeekDay(date: Date): string {
  if (isToday(date)) {
    return t('Today');
  }

  if (isTomorrow(date)) {
    return t('Tomorrow');
  }

  // TODO: locale options to translate this
  return formatDFNS(date, 'EEE');
}
</script>

<template>
  <div class="w-full px-4 py-8 bg-white rounded-md shadow-sm mb-4">
    <div
      class="w-full flex items-center"
      data-testid="calendarHeader"
    >
      <button
        type="button"
        class="control-btn"
        @click="emit('previousWeekRequested')"
        :disabled="isPrevDisabled"
      >
        <SVGIcon
          name="chevron-down"
          color="currentColor"
          class="w-4 h-4 rotate-90"
        />
      </button>
      <div class="w-full grid grid-cols-7">
        <div
          v-for="day in days"
          :key="day.toDateString()"
          class="flex flex-col items-center"
        >
          <span class="font-body font-medium text-doc-blue-800">
            {{ formatWeekDay(day) }}
          </span>
          <span class="font-body text-sm text-doc-blue-800">
            {{ formatDFNS(day, 'dd MMM') }}
          </span>
        </div>
      </div>
      <button
        type="button"
        class="control-btn"
        @click="emit('nextWeekRequested')"
      >
        <SVGIcon
          name="chevron-down"
          color="currentColor"
          class="w-4 h-4 -rotate-90"
        />
      </button>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.control-btn {
  @apply cursor-pointer bg-doc-blue-100 hover:bg-doc-blue-200 text-doc-blue-500;
  @apply flex justify-center items-center p-2 rounded-full min-w-8 min-h-8;
  transition: background-color 0.3s ease;

  &:disabled {
    @apply cursor-not-allowed bg-base-200 text-doc-blue-300;
  }
}
</style>
