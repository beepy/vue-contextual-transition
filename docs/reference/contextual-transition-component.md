# `ContextualTransition` Component

Wrap this component around any content that you want to apply the transitions to. In plain Vue projects, the intended use is to wrap it around your main `RouterView`.

```html
<template>
  <RouterView v-slot="{ Component }">
    <ContextualTransition>
      <component :is="Component" />
    </ContextualTransition>
  </RouterView>
</template>
```

All properties are optional.

| Property | Type     | Default | Description                                            |
| -------- | -------- | ------- | ------------------------------------------------------ |
| `group`  | `string` | `"page"`  | Used to avoid conflicts if using multiple instances |
| `duration`  | `number` | `222`     | Duration of transition, in milliseconds                   |
| `container-x` | `string` | `"100%"` | A legal CSS value, e.g. `25%` or `100px`. The amount to animate the transitioning content on the X-axis if the content uses the `v-relative-slide` directive. Outgoing content will move in the opposite direction. |
| `container-y` | `string` | `"0%"` | A legal CSS value, e.g. `0%` or `0rem` (but not just `0`). The amount to animate the transitioning content on the Y-axis if the content uses the `v-relative-slide` directive. Outgoing content will move in the opposite direction. |
| `comparator` | `ComparatorType` | numerical comparison | A function to compare `v-relative-slide` values. Returns a negative, positive, or zero value. |
| `allow-overflow` | `boolean` | `false` | To allow transitioning elements to overflow the transitioning container, set this to `true` |
| `allow-motion` | `boolean` | `true` | To dynamically prevent any motion regardless of the user's "prefers reduced motion" setting, you can set this property to false. |

The `group` property only needs to be set in the situation where you might have multiple `ContextualTransition` instances: in those cases, the transitioning containers must all be assigned the same group as their ancestor `ContextualTransition` component using the [`v-shared-element-group` directive](./directives#v-shared-element-group-directive).

The `ComparatorType` is defined as:

```ts
export type ComparatorType = (a: any, b: any) => number;
```

The default function compares only numbers, or strings that can be evaluated to numbers. For more complex behavior, for example, comparing dates or strings, you can provide your own comparator function.
