<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';

import { useRescheduleStore } from '../store';

const props = defineProps<{
  appointmentId: string;
}>();

const store = useRescheduleStore();

const { fetchAvailableSlots, getAppointmentDetails } = store;
const { availableSlots, doctor } = storeToRefs(store);

onBeforeMount(() => {
  getAppointmentDetails(props.appointmentId);
});
</script>

<template>
  <div class="container mt-10">
    <p
      class="font-body text-base text-base-900 mb-4"
      v-html="$t('Confirm your appointment with {doctor}', { doctor: `Dr. ${doctor.firstName} ${doctor.lastName}` })"
    />
    <p class="font-body text-base text-base-900 mb-4">
      This is a test for the API and the util functions
    </p>
    <button
      type="button"
      class="rounded bg-doc-teal-300 hover:bg-doc-teal-500 p-2 text-white font-body"
      @click.prevent="fetchAvailableSlots('20240429')"
    >
      Fetch slots
    </button>
    <div>
      {{ availableSlots }}
    </div>
  </div>
</template>

<style lang="postcss" scoped>

</style>
