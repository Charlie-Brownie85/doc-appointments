<script setup lang="ts">
import RescheduleView from './modules/Rescheduler/views/RescheduleView.vue';

const hardcodedAppointmentId = '123';
</script>

<template>
  <div class="max-w-7xl my-0 mx-auto p-8 font-normal">
    <!-- In larger apps here it will be routerLink etc -->
    <!-- The props for the view could be passed by route params instead. For this example there are hardcoded -->
    <RescheduleView :appointment-id="hardcodedAppointmentId" />
  </div>
  <TheFooter />
</template>

<style lang="postcss" scoped>

</style>
