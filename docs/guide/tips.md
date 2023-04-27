# Tips

- The transitioning content view should be resilient enough not to change its flow when its `position` property becomes `absolute`; the *width* of the element will be programmatically preserved, but its margins will not.

- Avoid elements in the transitioning content that have margins that might extend past the bounds of the content container (for example, having the first child be a paragraph with a top margin). This is because when the content is transitioned out and given an absolute position, the margin that may have been moving the content down the page will no longer apply and the content will jump.

- Shared elements marked for transition cannot have a `display` property of `inline`. Use `inline-block`.

- Transitioning elements that are greatly different sizes but don’t appear to fill their bounds may cause the elements to look like they are going to the wrong place, because the visual change in scale can be so much larger than the visual change in position. In these cases, consider setting  `scale` to `none` or `free`.

- When transitioning images, the size of the image must be consistent before it has been loaded — meaning essentially you must know the size or aspect ratio of the image beforehand.

- For Shared Element Transitions to work, the elements must exist when the transition stars. Using fallback content while the component loads its content (such as when using `<Suspense>`) won't work.