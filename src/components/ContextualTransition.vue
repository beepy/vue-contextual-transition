<template>
  <div
    :class="{
      'contextual-transition-container': true,
      'contextual-transition-reduced-motion': !allowMotion,
      'contextual-transition-allow-overflow': props.allowOverflow,
    }"
  >
    <Transition
      name="contextual-transition"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @enter-cancelled="onEnterCancelled"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
      @after-leave="onAfterLeave"
      @leave-cancelled="onLeaveCancelled"
    >
      <slot />
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { defineProps, withDefaults, watch, toRef } from 'vue';
import {
  ComparatorType,
  useContextualTransition,
  updateContextualTransition,
} from '../contextualTransition';

const props = withDefaults(
  defineProps<{
    group?: string;
    duration?: number; // ms
    containerX?: string;
    containerY?: string;
    comparator?: ComparatorType | undefined;
    allowMotion?: boolean;
    allowOverflow?: boolean;
  }>(),
  {
    group: 'page',
    duration: 222,
    containerX: '25%',
    containerY: '0%',
    comparator: undefined,
    allowMotion: true,
    allowOverflow: false,
  }
);

const {
  onBeforeEnter,
  onEnter,
  onEnterCancelled,
  onBeforeLeave,
  onLeave,
  onAfterLeave,
  onLeaveCancelled,
  onAfterEnter,
} = useContextualTransition({
  duration: props.duration,
  group: props.group,
  x: props.containerX,
  y: props.containerY,
  comparator: props.comparator,
  allowMotion: props.allowMotion,
});

const duration = toRef(props, 'duration');
const containerX = toRef(props, 'containerX');
const containerY = toRef(props, 'containerY');
const allowMotion = toRef(props, 'allowMotion');
watch([duration, containerX, containerY, allowMotion], () => {
  updateContextualTransition({
    duration: duration.value,
    group: props.group,
    x: containerX.value,
    y: containerY.value,
    allowMotion: allowMotion.value,
  });
});
</script>
