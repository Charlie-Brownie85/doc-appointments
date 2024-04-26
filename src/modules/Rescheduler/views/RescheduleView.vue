<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useReschedulerStore } from '../store';

const store = useReschedulerStore();

const { fetchAvailableSlots } = store;
const { availableSlots } = storeToRefs(store);
</script>

<template>
  <div class="container">
    <h1 class="font-body text-3xl text-base-900 mb-2">
      Rescheduler
    </h1>
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
