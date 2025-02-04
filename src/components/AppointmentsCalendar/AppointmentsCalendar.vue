<script setup lang="ts">
import { ref, computed } from 'vue';

import {
  isToday,
  isTomorrow,
  addDays,
  isSameDay,
  format as formatDFNS,
} from 'date-fns';

import i18n from '@/i18n';

import { DATE_FORMATS } from '@/config';

import type { AgendaDay, AppointmentSlot } from '@/types';

export interface Props {
  startingDate: Date,
  availableSlots: AgendaDay[],
  isFetchingSlots?: boolean,
  isFetchError?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  isFetchingSlots: false,
  isFetchError: false,
});

const emit = defineEmits(['slotSelected', 'previousWeekRequested', 'nextWeekRequested']);

const { t } = i18n.global;

const isFolded = ref(true);

const slotSelected = ref<AppointmentSlot | null>(null);

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

function selectSlot(slot: AppointmentSlot) {
  slotSelected.value = slot;
  emit('slotSelected', slotSelected.value);
}
</script>

<template>
  <div class="w-full pt-8 pb-4 px-8 bg-white rounded-md shadow-sm">
    <div>
      <div
        class="w-full grid grid-cols-[8%_1fr_8%] justify-items-center items-center mb-4"
        data-testid="calendarHeader"
      >
        <button
          type="button"
          class="control-btn justify-self-start"
          @click="emit('previousWeekRequested')"
          data-testid="previousWeekButton"
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
            <span class="font-body font-medium text-doc-blue-800 select-none">
              {{ formatWeekDay(day) }}
            </span>
            <span class="font-body text-sm text-doc-blue-800 select-none">
              {{ formatDFNS(day, DATE_FORMATS.CALENDAR_DATE) }}
            </span>
          </div>
        </div>
        <button
          type="button"
          class="control-btn justify-self-end"
          data-testid="nextWeekButton"
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
        v-if="isFetchError"
        class="w-full h-full flex items-center justify-center min-h-[19rem]"
      >
        <p class="font-body text-3xl text-doc-blue-800 text-center">
          {{ $t('An error occurred while fetching the available slots') }}
        </p>
      </div>
      <div
        v-else
        class="w-full grid grid-cols-[8%_1fr_8%] grid-rows-[1fr_3.25rem] justify-items-center items-center"
        data-testid="calendarBody"
      >
        <div
          v-if="isFetchingSlots"
          class="min-h-[19rem] flex items-center justify-center col-start-2 row-start-1"
        >
          <span
            class="block loader text-doc-teal-300 !w-16 !h-16"
            data-testid="loader"
          />
        </div>
        <div
          v-else
          class="slots-container"
          :class="{ 'slots-container--expanded': !isFolded }"
        >
          <div
            v-for="day in agendaDays"
            :key="day.date.toDateString()"
            class="flex flex-col items-center gap-3"
          >
            <AppointmentTimeSlot
              v-for="slot in day.availableSlots"
              :key="slot.start"
              :appointment-slot="slot"
              :is-selected="slot.start === slotSelected?.start"
              @slot-selected="selectSlot"
            />
          </div>
        </div>
        <div
          class="py-2 col-start-2 row-start-2"
          data-testid="toggleContainer"
        >
          <button
            type="button"
            class="bg-transparent text-doc-blue-600 hover:underline flex justify-center items-center gap-2"
            @click="isFolded = !isFolded"
          >
            <span class="text-base font-body font-semibold">{{ isFolded ? $t('See more hours') : $t('Less') }}</span>
            <SVGIcon
              name="chevron-down"
              color="currentColor"
              class="w-5 h-5 transition-transform duration-300 ease-in-out"
              :class="{ 'rotate-x-180': !isFolded }"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.control-btn {
  @apply cursor-pointer bg-doc-blue-100 hover:bg-doc-blue-200 text-doc-blue-600;
  @apply flex justify-center items-center p-2 rounded-full min-w-8 min-h-8;
  transition: background-color 0.3s ease;

  &:disabled {
    @apply cursor-not-allowed bg-base-200 text-doc-blue-300;
  }
}

.slots-container {
  @apply col-start-2 w-full row-start-1 grid grid-cols-7 border-b-2 border-base-300;
  @apply max-h-[19rem] min-h-[19rem] h-full overflow-hidden;
  transition: max-height 0.5s ease-in-out;

  &--expanded {
    @apply max-h-[3000px] pb-3;
  }
}

.rotate-x-180 {
  transform: rotateX(180deg);
}
</style>
