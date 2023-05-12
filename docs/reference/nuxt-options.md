# Nuxt Module Options

`nuxt-contextual-transition` by default will:

1. Restore the scroll position when moving backwards through history
2. Smooth scroll when an on-page link is clicked, i.e. when clicking on a link to an anchor tag somewhere else on the same page

There is a single option you can use to configure the scrolling behavior when clicking on anchor tags to navigate somewhere in the same page.

::: tip
This option doesn't have anything to do with the transitions that the module does. Restoring the scroll position when navigating backwards in history and smooth scrolling when clicking on anchor tags are provided as a convenience
:::

In your `nuxt.config.ts`, you can specify a behavior:

```ts
export default defineNuxtConfig({
  // ... other config properties
  contextualTransition: {
    hashScroll: 'smooth' // the default
  }
})
```

Valid values for `hashScroll` are `false` or [one of the `behavior` options](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo) documented for the `scrollTo` method for `Element`.

| Value     | Behavior |
| --------- | -------- |
| `false` | Do nothing (do not scroll) |
| `"smooth"` | Default. Smoothly scroll to the anchor target on the page |
| `"instant"` | Instantly scroll to the anchor target on the page |
| `"auto"` | Scroll behavior is determined by the computed value of the css property [`scroll-behavior`](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior) |

