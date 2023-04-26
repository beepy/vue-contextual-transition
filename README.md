# vue-contextual-transition

# Vue Contextual Transition

This module makes it easier to provide meaningful cross-browser transitions between pages — or other state changes if desired — for Vue projects. It provides a single opinionated transition that can animate between pages in two ways:

1. **Shared Element Transition**: intended for navigating up and down a site's hierarchy, for example, from a blog index to a blog post. Individual elements, like a post title and a thumbnail image, can be transitioned from their appearance on an index page to their appearance on a post page, and back. Not be confused with the experimental [Chrome feature, View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions/).

2. **Relative Slide Transition**: intended for navigating laterally in a site's hierarchy, that is, between pages of like-content such as navigating from a current blog post to an older blog post. Content can slide horizontally (or vertically if preferred).

In both cases, content and element relationships are declared via directives.


