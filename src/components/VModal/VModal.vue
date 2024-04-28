<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue';
import { useScrollLock, onKeyStroke } from '@vueuse/core';

const props = withDefaults(defineProps<{
  modelValue: boolean,
  contentClasses?: string,
  clickOutside?: boolean,
  showCloseBtn?: boolean,
}>(), {
  modelValue: true,
  contentClasses: '',
  clickOutside: true,
  showCloseBtn: true,
});

const emit = defineEmits(['update:modelValue']);

// As project template established Vue version 3.3 "defineModel" is not available
// I rather upgrade Vue version (3.4) to the latest and use it
// const model = defineModel<boolean>({ default: true });

const scrollLock = useScrollLock(document?.querySelector('html'));

const close = () => {
  emit('update:modelValue', false);
};

onKeyStroke('Escape', (e) => {
  e.preventDefault();
  close();
});

watch(() => props.modelValue, (value) => {
  if (value) {
    scrollLock.value = true;
  } else {
    scrollLock.value = false;
  }
}, { immediate: true });

onBeforeUnmount(() => {
  scrollLock.value = false;
});
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="modelValue"
        :class="[
          'fixed inset-0 flex items-center justify-center bg-base-900 bg-opacity-50 v-modal overscroll-y-auto p-8',
          $attrs.class,
          { 'cursor-pointer': clickOutside },
        ]"
        tabindex="0"
        data-testid="mainEl"
        @click.self="() => {
          if (clickOutside) close()
        }"
        @keydown.esc="() => {
          if (clickOutside) close()
        }"
      >
        <div
          class="bg-white shadow rounded-lg v-modal__window"
          :class="['v-modal__window p-8 pt-10 shadow w-full relative cursor-auto initial:max-w-2xl', contentClasses]"
          data-testid="modalWindow"
        >
          <button
            v-if="showCloseBtn"
            class="!absolute !p-1 z-10 top-2 right-2 cursor-pointer"
            aria-label="close"
            data-testid="closeBtn"
            @click="close"
          >
            <SVGIcon
              name="close"
              color="currentColor"
              class="w-3 h-3"
            />
          </button>
          <div data-testid="content">
            <slot
              name="content"
              :close="close"
            />
          </div>
          <div
            v-if="!!$slots.actions"
            class="-mb-2"
            data-testid="actions"
          >
            <hr class="mt-8 mb-5 border-0 border-t border-base-400">
            <div class="flex justify-end space-x-6">
              <slot
                name="actions"
                :close="close"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style lang="postcss" scoped>
.v-modal {
  z-index: 50;
}
.fade-enter-from .v-modal__window,
.fade-leave-to .v-modal__window {
  transform: scale(0.9);
}
.fade-enter-active .v-modal__window,
.fade-leave-active .v-modal__window {
  transition: all 0.5s ease;
}
</style>
