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

import { DATE_FORMATS } from '@/config';

import type { AgendaDay } from '@/types';

export interface Props {
  startingDate: Date,
  availableSlots: AgendaDay[],
}

const props = defineProps<Props>();

const emit = defineEmits(['slotSelected', 'previousWeekRequested', 'nextWeekRequested']);

const { t } = i18n.global;

const days = computed(() => Array.from({ length: 7 }, (_, i) => addDays(props.startingDate, i)));

const agendaDays = computed(() => days.value.map((day) => {
  const response = props.availableSlots.find((agendaDay) => isSameDay(agendaDay.date, day));

  return {
    date: day,
    availableSlots: response?.availableSlots || [],
  };
}));

const isPrevDisabled = computed(() => isToday(props.startingDate));

function formatWeekDay(date: Date): string {
  if (isToday(date)) {
    return t('Today');
  }

  if (isTomorrow(date)) {
    return t('Tomorrow');
  }

  // TODO: locale options to translate this
  return formatDFNS(date, DATE_FORMATS.CALENDAR_WEEK_DAY);
}
</script>

<template>
  <div class="w-full p-8 bg-white rounded-md shadow-sm mb-4">
    <div
      class="w-full grid grid-cols-[8%_1fr_8%] justify-items-center items-center mb-4"
      data-testid="calendarHeader"
    >
      <button
        type="button"
        class="control-btn justify-self-start"
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
            {{ formatDFNS(day, DATE_FORMATS.CALENDAR_DATE) }}
          </span>
        </div>
      </div>
      <button
        type="button"
        class="control-btn justify-self-end"
        @click="emit('nextWeekRequested')"
      >
        <SVGIcon
          name="chevron-down"
          color="currentColor"
          class="w-4 h-4 -rotate-90"
        />
      </button>
    </div>
    <div
      class="w-full grid grid-cols-[8%_1fr_8%] justify-items-center items-center"
      data-testid="calendarBody"
    >
      <div class="slots-container col-start-2 w-full grid grid-cols-7">
        <div
          v-for="day in agendaDays"
          :key="day.date.toDateString()"
          class="flex flex-col items-center gap-4"
        >
          <div
            v-for="slot in day.availableSlots"
            :key="slot.start"
            class="appointment-slot"
            :class="{ 'appointment-slot--taken': slot.taken }"
            @click="() => emit('slotSelected', slot)"
          >
            <span>{{ formatDFNS(slot.start, DATE_FORMATS.APPOINTMENT_TIME) }}</span>
          </div>
        </div>
      </div>
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

.appointment-slot {
  @apply px-4 py-1 flex justify-center items-center border-2 border-transparent bg-doc-blue-200 cursor-pointer rounded-md;
  transition: border-color 0.3s ease;

  &:hover:not(.appointment-slot--taken) {
    @apply border-doc-blue-500;
  }

  span {
    @apply font-body font-medium text-doc-blue-500 select-none;
  }

  &--taken {
    @apply bg-transparent cursor-not-allowed;

    span {
      @apply text-base-500 line-through;
    }
  }
}
</style>
