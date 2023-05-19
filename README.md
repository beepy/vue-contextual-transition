# Vue Contextual Transition

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

This module makes it easier to provide meaningful cross-browser transitions between pages — or other state changes if desired — for Vue 3 projects. It provides a single opinionated transition that can animate in two ways, and looks like this:

<p align="center">
  <img src="https://beepy.github.io/vue-contextual-transition/demo.gif" />
</p>

[**Live Demo**](https://beepy.github.io/example-use-of-vue-contextual-transition)

The two styles are:

1. **Shared Element Transition**: intended for navigating up and down a site's hierarchy, for example, from a blog index to a blog post. Individual elements, like a post title and a thumbnail image, can be transitioned from their appearance on an index page to their appearance on a post page, and back (not to be confused with the experimental [Chrome feature, View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions/)).
  
  An element can be designated for transitioning like this:
  
  ```html
  <img
    src="..."
    v-shared-element="{ id: post.slug, role: 'image', type: 'post' }"
  />
  ```

2. **Relative Slide Transition**: intended for navigating laterally in a site's hierarchy, that is, between pages of like-content such as navigating from a current blog post to an older blog post. Content can slide horizontally (or vertically if preferred).
  
  A page view can be designated for transitioning like this:

  ```html
  <template>
    <div v-relative-slide="{ value: post.sortOrder, type: 'post' }">
      <!-- page content -->
    </div>
  </template>
  ```

In both cases, content and element relationships are declared via directives.

Using Nuxt? Please see [nuxt-contextual-transition](https://github.com/beepy/nuxt-contextual-transition).

[Please see the docs for details](https://beepy.github.io/vue-contextual-transition/).

## Contributing

Please open an issue to discuss fixes/features before making a pull request.

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/vue-contextual-transition/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/vue-contextual-transition

[npm-downloads-src]: https://img.shields.io/npm/dm/vue-contextual-transition.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/vue-contextual-transition

[license-src]: https://img.shields.io/npm/l/vue-contextual-transition.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/vue-contextual-transition
