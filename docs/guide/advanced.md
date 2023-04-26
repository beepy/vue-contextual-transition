# Advanced

## Per-route

If you don't want all routes to use the Contextual Transition component, one solution is to use routes' meta property to specify the transition details.

First, create a dynamic `transition` component in your `RouterView`. It must be wrapped in an element with a css `position` of `relative`. It's clearest to use the provided class `.contextual-transition-container`.

```vue
<template>
  <!-- rest of App.vue -->
  <RouterView v-slot="{ Component, route }">
    <!--
      you need to manually include this container to position
      transitioning elements correctly
    -->
    <div class="contextual-transition-container">
      <transition v-bind="route.meta.transition">
        <component :is="Component" />
      </transition>
    </div>
  </RouterView>
</template>
```

Second, supply the Contextual Transition hooks to the meta field in your router using the `useContextualTransition` function.

```ts
import { createRouter, createWebHistory } from 'vue-router';
import { useContextualTransition } from 'vue-contextual-transition'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  // recommended regardless
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },

  routes: [
    // ... other routes
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogView.vue'),
      meta: { transition: useContextualTransition() }
    },
    {
      path: '/blog/:slug',
      component: () => import('../views/PostView.vue'),
      meta: { transition: useContextualTransition() }
    }
    // ... other routes
  ]
});

export default router;

```

