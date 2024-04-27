<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';

import { useRescheduleStore } from '../store';

const props = defineProps<{
  appointmentId: string,
}>();

const store = useRescheduleStore();

const { initStore } = store;
const { doctor, appointmentBooked, availableSlots } = storeToRefs(store);

onBeforeMount(() => {
  initStore(props.appointmentId);
});
</script>

<template>
  <div class="container mt-10">
    <p
      class="font-body text-lg text-doc-blue-800 mb-8"
      v-html="$t('Confirm your appointment with {doctor}', { doctor: `Dr. ${doctor.firstName} ${doctor.lastName}` })"
    />
    <AppointmentPreview
      v-if="appointmentBooked"
      :appointment-booked="appointmentBooked"
    />
    <p class="font-body font-bold text-lg text-doc-blue-800 mt-8">
      {{ $t('Did you have an unexpected situation?') }}
    </p>
    <p class="font-body text-lg text-doc-blue-800 mb-8">
      {{ $t('You can change the appointment for when it suits you better.') }}
    </p>
    <p class="font-body text-base text-base-900 mb-4">
      This is a test for the API and the util functions
    </p>
    <button
      type="button"
      class="rounded bg-doc-teal-300 hover:bg-doc-teal-500 p-2 text-white font-body"
      @click.prevent="initStore(props.appointmentId)"
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
