# `useContextualTransition` Function

For basic behavior, use the [ContextualTransition component](contextual-transition-component), but for advanced use — for example, to only apply the transition on certain routes, you can use the `useContextualTransition()` function. Note that you will be responsible for enclosing the transition inside an element with a `position` of `relative` and `padding` of `0`.

`useContextualTransition()` takes a single `options` object with the following properties:

 Property     | Type             | Default    | Description                                                                                                                  |
| ------------ | ---------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `duration`      | `number`         | `222`      | Duration of the transition, in milliseconds                                                                                     |
| `group`      | `string`         | `"page"`   | An arbitrary group name to associate transitions with. Transitions belonging to different groups will not affect each other. |
| `comparator` | `ComparatorType` | numerical comparison | A comparator function to use when considering Relative Slide transitions.                                                    |
| `x`          | `string`         | `"25%"`    | A valid CSS unit value for horizontal animation on Relative Slide transitions.                                                                       |
| `y`          | `string`         | `"0%"`     | A valid CSS unit value for vertical animation on Relative Slide transitions.                                                                                                              |
| `allowMotion` | `boolean` | `true`  | To dynamically prevent motion, set this to `false`. |

The `ComparatorType` is defined as:

```ts
export type ComparatorType = (a: any, b: any) => number;
```

The default function compares only numbers, or strings that can be evaluated to numbers. For more complex behavior, for example, comparing dates or strings, you can provide your own comparator function.
