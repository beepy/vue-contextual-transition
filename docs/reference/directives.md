# Directives

## `v-shared-element` Directive

This directive simplifies adding data attributes to the individual elements you wish to transition. It is required to see any useful animation. You pass a configuration object to indicate which element to transition to/from.

Example:

```html
<img
  :src="someContent.headerImage.src"
  v-shared-element="{
    id: someContent.id,
    role: 'img'
}" />
```


| Attribute | Type                  | Default     | Description                                                                                                                                                                                                                 |
| --------- | --------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`      | `string`              | *required*  | The identifier for the content that this element belongs to.                                                                                                                                                                |
| `role`    | `string`              | *required*  | The role this content should play in the transition. For example, if your content has a header image, links to it may be presented with a thumbnail image, both the header and thumbnail image might have the role of `img` |
| `scale`   | `"preserve"` \| `"free"` \| `"none"` | `preserve` | Normally, the element will scale to fit within its new size while maintaining its aspect ratio. To allow the aspect ratio to change, set `scale` to `free`. To prevent scaling, set `scale` to `"none"` |
| `only`    | `undefined` \| `"enter"` \| `"leave` | `undefined` | When set, limits the element's transition to only transitioning in or out. |

You might wish to turn off scaling for text elements that are left- or right-aligned but don't tend to take up their full width. Otherwise, during the transition of a wide element to a narrow element, the large element may appear to drift horizontally as it scales to the size of the small element.

## `v-relative-slide` Directive

This directive assigns an ordinal value to a container being transitioned, and a required peer group to which the content belongs. Content in different peer groups will not be considered for relative transitions.

```html
<div
  v-relative-slide="{ value: post.sortOrderValue, group: 'posts }"
>
  <h2>{{ post.title }}</h2>
  <!-- etc. -->
</div>
```

## `v-shared-element-teleport` Directive

If for any reason some of the elements in a view have been [teleported](https://vuejs.org/guide/built-ins/teleport.html#teleport) elsewhere in the DOM structure, they won't be discoverable by the Contextual Transition. To reveal them, use the `v-shared-element-teleport` directive to specify a selector for the container in which the teleported elements can be found.

Basically, it looks like this (but there's a catch):

```html
<!-- this will work, but only for transitioning in -->
<div v-shared-element-teleport="'[data-my-modal]']">
    <!-- some content -->
    <img src="..." v-shared-element="{ id: x, role: 'img' }" />
  <Teleport to="body">
    <div data-my-modal="">
      <!-- some other content; considered for transition -->
      <h2 v-shared-element="{ id: x, role: 'title' }">
        {{ title }}
      </h2>
    </div>
  </Teleport>
</div>

```

The catch — that this simple approach only works for transitioning in — is because the teleported elements don't automatically persist when the view is transitioning away.

