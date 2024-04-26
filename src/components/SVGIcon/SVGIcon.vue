<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const props = withDefaults(defineProps<{
  name: string;
  color?: string
}>(), {
  color: 'black',
});

const svg = defineAsyncComponent(() => import(`../../assets/icons/${props.name}.svg`));

</script>
<template>
  <component
    :is="svg"
    :fill="props.color"
  />
</template>
