<template>
  <div class="simple-demo">
    <ContextualTransition group="demo2" :duration="500">
      <div
        :key="selectedPost.slug"
        v-relative-slide="{ value: selectedPost.index, type: 'posts' }"
        class="post"
      >
        <div
          class="header"
          :style="`background-color: ${selectedPost.color};`"
        />
        <h3>{{ selectedPost.title }}</h3>
        <div class="text" v-html="selectedPost.content" />
      </div>
    </ContextualTransition>
    <button v-if="selectedPost.index > 0" style="float: left" @click="previous">
      Previous
    </button>
    <button
      v-if="selectedPost.index < posts.length - 1"
      style="float: right"
      @click="next"
    >
      Next
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import posts from '../data/sampleData';
const expanded = ref<string>(posts[0].slug);

function setActive(slug: string) {
  expanded.value = slug;
}

function next() {
  const i = posts.findIndex((p) => p.slug === expanded.value);

  if (i >= 0 && i < posts.length - 1) {
    setActive(posts[i + 1].slug);
  }
}

function previous() {
  const i = posts.findIndex((p) => p.slug === expanded.value);

  if (i >= 1) {
    setActive(posts[i - 1].slug);
  }
}

const selectedPost = computed(() => {
  const index = posts.findIndex((p) => p.slug === expanded.value);
  if (index >= 0) {
    return {
      ...posts[index],
      index,
    };
  } else {
    return undefined;
  }
});
</script>

<style></style>
