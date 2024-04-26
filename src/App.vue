<script setup lang="ts">
import RescheduleView from './modules/Rescheduler/views/RescheduleView.vue';

const hardcodedAppointmentId = '123';
</script>

<template>
  <div>
    <!-- In larger apps here it will be routerLink etc -->
    <!-- The props for the view could be passed by route params instead. For this example there are hardcoded -->
    <RescheduleView :appointment-id="hardcodedAppointmentId" />
  </div>
</template>

<style lang="postcss" scoped>

</style>
