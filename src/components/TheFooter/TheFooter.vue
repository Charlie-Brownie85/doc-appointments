<script setup lang="ts">
import DocLogo from '@/assets/img/docplanner-logo.svg';
</script>

<template>
  <div
    class="w-full h-[theme('sizes.footer.height')] bg-doc-teal-300 flex justify-center items-center"
  >
    <DocLogo
      :src="DocLogo"
      alt="DocPlanner logo"
      class="w-32"
    />
  </div>
</template>
