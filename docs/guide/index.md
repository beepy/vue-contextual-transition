# Getting Started

For plain Vue projects, follow the instructions below for `vue-contextual-transition`. For Nuxt projects, use the instructions for `nuxt-contextual-transition`, which is a convenience wrapper.

[This example site](https://beepy.github.io/example-use-of-vue-contextual-transition/) demonstrates basic use. You can see [its source here.](https://github.com/beepy/example-use-of-vue-contextual-transition)

## Vue

### Install `vue-contextual-transition` for Vue Projects

::: code-group

```sh [npm]
$ npm add vue-contextual-transition
```

```sh [yarn]
$ yarn add vue-contextual-transition
```

:::

In your `main.ts` or wherever you create your Vue app:

```ts
import { install as VueContextualTransition } from  
  'vue-contextual-transition';

// imports a small amount of required css
import "vue-contextual-transition/dist/style.css";

const app = createApp(App)

// ...
app.use(VueContextualTransition)
// ...
app.mount('#app')
```

### Use for RouterView in Vue Projects

In your `App.vue`:

```html
<template>
  <RouterView v-slot="{ Component }">
    <ContextualTransition>
      <component :is="Component" />
    </ContextualTransition>
  </RouterView>
</template>
```

Preserving the user's scroll position on history navigation is recommended but not required:

```ts
// router/index.ts

import { createRouter } from 'vue-router';

const router = createRouter({

  // ... other router properties
  
  // used the saved scroll position when navigating back
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return to.hash ?
        { el: to.hash, behavior: 'smooth' } :
        { left: 0, top: 0 };
    }
  },

  // ... routes, etc.
  
});

export default router;

```

## Nuxt

### Install `nuxt-contextual-transition` for Nuxt Projects

::: code-group

```sh [npm]
$ npm add nuxt-contextual-transition
```

```sh [yarn]
$ yarn add nuxt-contextual-transition
```

:::

Then add `nuxt-contextual-transition` to the `modules` section of `nuxt.config.ts`:

```js
export default defineNuxtConfig({
  modules: [
    'nuxt-contextual-transition'
  ]
})
```

In `app.vue` or wherever you have your root `<NuxtPage />`:

```vue
<script setup>
const contextualTransition = useContextualTransition();
</script>

<template>
  <div class="contextual-transition-container">
    <NuxtPage :transition="contextualTransition">
  </div>
</template>
```

For scrolling behavior, see [the Nuxt Options](../reference/nuxt-options).

## Shared Element Transition

In a given view, for every element that *might* use the Contextual Transition, you should use the `v-shared-element` directive to specify the element's *role*, *id*, and *type*. The *id* and *type* should be the same for elements that are part of the same content. The role is an arbitrary string to transition like-elements. For example, you could use "title" for the title, and "img" for the thumbnail/header of a blog post.

Typically, you'll have an index page — say, of blog post titles, or of team member thumbnails — and an individual item's page, like a blog post or a team member bio.

The `v-shared-element` directive specifies where the content goes. For example, when transitioning from the individual item's page back to the index, the `id` property specifies which item in the index to transition to, and the `role` property specifies which element in the specified item to transition.

Here's an example:

```html
<!-- content index -->
<template>
  <div>
    <div v-for="item in allContent">
      <img
        :src="item.thumbnailImage.src"
        v-shared-element="{
          id: item.id,
          role: 'img',
          type: 'post'
        }"
      />
      <h4
        v-shared-element="{
          id: item.id,
          role: 'title',
          type: 'post'
        }"
      >{{ iteme.title}}</h4>
    </div>
  </div>
</template>
```

```html
<!-- content page -->
<template>
  <div>
    <img
      :src="item.headerImage.src"
      v-shared-element="{
        id: item.id,
        role: 'img',
        type: 'post'
    }" />
    <!--
      use scale: 'none' if you have textual content that may
      take up only a fraction of its width, e.g. wide titles
      that may be short
    -->
    <h2 v-shared-element="{
      id: item.id,
      role: 'title',
      type: 'post',
      scale: 'none'
    }">{{ item.title }}</h2>
    <!--
      rest of content...
    -->
  </div>
</template>
```

::: tip

If you are using UUIDs or other unique identifiers for your content, you technically could exclude the `type` property. The element's id, role, and type are all combined to make a tag for the content to compare to other elements to determine whether a transition should occur.

:::

## Relative Slide Transition

For a given view that might use the Relative Slide Transition — a view that will be the direct child of the `<ContextualTransition>` component — you use the `v-relative-slide` directive to specify what its relationship to its peers is. The `value` property specifies a value (numeric is easiest) to indicate whether this content will come before or after a peer (where higher numbers come after lower numbers) and the `type` is a string indicating the type of content.

For example, let's say you have a site with blog posts and post authors. Each author has a bio page. You can navigate between individual posts with "next" and "previous" links, and you can navigate between authors with "next" and "previous" links.

For the view that displays individual posts, you would use something like this:

```html
<!-- post.vue -->
<template>
  <div v-relative-slide="{
    type: 'post',
    value: post.orderValue
  }">
    <!-- orderValue may be derived from the post date, say -->
    <h2>{{ post.title }}</h2>
    <p>By <a :href="post.linkToAuthor">{{ post.author.name }}</a></p>
    <!--
      rest of content, including previous and next post links
    -->
  </div>
</template>
```

The view that displays bios would be very similar:

```html
<!-- author.vue -->
<template>
  <div v-relative-slide="{
    type: 'author',
    value: author.orderValue
  }">
    <!-- orderValue may be derived from the author name, say -->
    <h2>{{ author.name }}</h2>
    <!--
      rest of content, including previous and next author links
    -->
  </div>
</template>
```

Clicking the previous and next links on the posts or authors would trigger the Relative Slide Transition. But clicking on the author link on the posts would not, even though both views use the `v-relative-slide` directive, because they specify different types.
