# vue-contextual-transition Reference

Vue Element Transition is made up of a few pieces

1. A component, `ContextualTransition`, which encapsulates the composable.
2. Directives, `v-shared-element`, which describes which elements might be shared across pages, `v-relative-slide`, which describes which views might be transitioned with a slide,  and `v-shared-element-teleport` for advanced situations where some elements may be outside of the transitioning view.
3. A function, `useContextualTransition` which returns a [TransitionProps](https://vuejs.org/api/built-in-components.html#transition) object that performs the animations. Normally you do not need to use this directly.
4. A small amount of css which handles the fading and superimposition of content during a transition.



