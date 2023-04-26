# CSS

There are about [100 lines of CSS](https://github.com/beepy/vue-contextual-transition/blob/main/src/styles/shared.css) to support the transitions. If you're using the `ContextualTransition` component, you probably won't need to deal with them directly, but there are some cases where the follwing classes may be of use.

### `.contextual-transition-container`

If you're not using the `ContextualTransition` component, this class can be applied to whatever container you are manually applying the transition to. It sets the `position` to `relative` and `padding` to `0`.

## `.contextual-transition-allow-overflow`

If you're not using the `ContextualTransition` component, this class can be applied to whatever container you are manually applying the transition to. It allows the transitioning elements to overflow the container. It's equivalent to setting `:allow-overflow="true"` in the component.

By default, transitioning elements are clipped to the container, to prevent scrollbars from appearing during page transitions.

## `.contextual-transition-reduced-motion`

Normally, transitions respect the user's "prefers reduced motion" setting. If you're not using the `ContextualTransition` component, this class can be applied to whatever container you are manually applying the transition to. It will inhibit any motion (i.e. transitions only cross-fade). It's equivalent to setting `:allow-motion="false"` in the component.

## Transition Classes

You can also use the `.contextual-transition-*` classes to get a free cross-fade. You'll need to set the transition duration CSS variable (`--contextual-transition-duration`) manually if you don't want to use the default 222ms, like this:

```vue
<template>
  <div class="contextual-transition-container">
    <Transition name="contextual-transition">
      <div
        v-if="someCondition"
        style="--contextual-transition-duration: 333ms;"
      >
        <!-- content etc. -->
      </div>
    </Transition>
  </div>
</template>
```
