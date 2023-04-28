<script setup>
import SimpleDemo from './components/SimpleDemo.vue'
import SimpleDemoTwo from './components/SimpleDemoTwo.vue'
</script>

# Vue Contextual Transition

This module makes it easier to provide meaningful cross-browser transitions between pages — or other state changes if desired — for Vue projects. It provides a single opinionated transition that can animate between pages in two ways:

1. **Shared Element Transition**: intended for navigating up and down a site's hierarchy, for example, from a blog index to a blog post:
  
  <SimpleDemo />

  [(Example source)](#source-for-contextual-transition)

  An element can be designated for transitioning like this:

  ```html
  <img
    src="..."
    v-shared-element="{ id: post.slug, role: 'image', type: 'post' }"
  />
  ```

  ::: tip
  This functionality should not be confused with the experimental [Chrome feature, View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions/) developed along with [this draft specification](https://drafts.csswg.org/css-view-transitions-1/) which was once called "shared element transitions." Nuxt has [experimental support for View Transitions](https://nuxt.com/docs/getting-started/transitions#view-transitions-api-experimental).
  :::

2. **Relative Slide Transition**: intended for navigating laterally in a site's hierarchy, that is, between pages of like-content such as navigating from a current blog post to an older blog post.
  
  <SimpleDemoTwo />

  [(Example source)](#source-for-slide-transition)

  A page view can be designated for transitioning like this:

  ```html
  <template>
    <div v-relative-slide="{ value: post.sortOrder, type: 'post' }">
      <!-- page content -->
    </div>
  </template>
  ```

---

In both cases, the animation is determined by simple directives which declare the relationships the page and certain elements on the page have with other pages.

Although we are differentiating these transitions, they are really two parts of the same transition triggered under different conditions. Typically both parts won't be triggered at the same time, but the same content may trigger either part depending on its relationship to the content the user is navigating to or from.

## Source for the Demos

Note that, unlike these demos, the typical use of this module will be for transitioning `RouterView`s.

### Source for Contextual Transition

<<< @/components/SimpleDemo.vue

### Source for Slide Transition

<<< @/components/SimpleDemoTwo.vue


