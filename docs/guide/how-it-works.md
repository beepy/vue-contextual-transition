# How It Works and What It Does

## Superimposition and Scrolling

For a cross-fade transition between pages to work — regardless of other animations happening during the transition — the entering page and the leaving page must occupy the same space at the same time. This requires using Vue's default transition mode (rather than out-first, for example), and using absolute positioning.

With Vue Contextual Transition, the leaving page is immediately given an `absolute` position, taking it out of the layout flow, but the entering page is not. This allows the entering page to establish the document height and the scroll bar state.

However, there are complications with the scroll bar state when dealing with the differences in the leaving and entering pages, which become especially important in cases when the user is navigating backwards in history and the entering page might be scrolled down. We don't want the leaving page to interfere with the scroll bar state which should only reflect the entering page.

The solution is, when absolutely positioning the leaving page, to both position it so that it doesn't look like its scroll positioned has change, and to clip it to the entering page's height. Below is an illustration of how this works in a simple scenario.

| Step | Illustration |
| ---- | ------------ |
| Before - user is about to navigate away. Note that they have scrolled down a bit. The scroll bar shows that there is more content above and below. | <img src="/about-to-leave.svg" style="width: 40vw; max-width: min(320px, 40vw)" alt="Illustration of leaving page that has been scrolled to the middle" /> |
| ❌ The user has navigated to a new page. The entering page correctly scrolls the window back to the top. But the leaving page -- still visible through the cross-fade -- has also scrolled to the top. The scroll bar shows more content below even though the entering content does not overflow the window. | ![Illustration of leaving page underneat the entering page, scrolled to the top](/unpositioned-and-unclipped.svg) |
| ❌ No problem! We'll just position the leaving page where it would be if it hadn't scrolled. Except the scroll bar is still wrong because there is still content below the bottom of the window. | ![Illustration of leaving page underneath the entering page, in the correct position but triggering the scroll bar ](/positioned-and-unclipped.svg) |
| ✅ The solution is to clip the leaving page to the bounds of the entering page. It is now showing the correct part of the leaving content and the scroll bar doesn't show unnecessarily. | ![Illustration of leaving page underneath the entering page correctly positioned and clipped ](/positioned-and-clipped.svg) |

## "Good Enough" Shared Element Transition

Transitioning between like elements — the same image presented at different sizes — is pretty straight forward. But transitioning between unlike elements is not.

In Chrome’s description of their shared element transition, they [hand-wave over a difficult problem](https://developer.chrome.com/docs/web-platform/view-transitions/#handling-changes-in-aspect-ratio). They illustrate transitioning an image represented in two elements with different aspect ratios. They use clipping to use the same asset for the thumbnail as for the full image, and assume that the thumbnail is a centered version of the original.

It looks great, even in slow motion, but in reality, the thumbnail will often be a completely different asset or a different version of the same asset cropped arbitrarily and this solution is not practical.

Shared element transitions in Vue Contextual Transition instead are just "good enough." They are meant to happen quickly and to give the impression of what element has moved, not literally morph a single element. The entering and leaving elements may be completely different, and there are no assumptions made about their common traits.

To achieve this, the Web Animation API is used on the shared elements, using transforms, scaling, and opacity. Below is an illustration of a "good enough" transition that would not work with Chrome’s solution above without manually specifying how the thumbnail was cropped:

![Illustration of good enough transition of a thumbnail image to a header image](/good-enough.png)

Note that the elements maintain their proportions while scaling. You can pass `scale: 'free'` to the `v-shared-element` directive to allow an element to be freely scaled if desired.

Elements won't move more than a certain value (as of this writing, hard-coded to 1280px). That is, the leaving element will only move so far towards the entering element, and the entering element will start only so far away from its ending position. This is to prevent elements moving at unnatural speeds.