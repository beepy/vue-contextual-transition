<template>
  <div class="simple-demo">
    <ContextualTransition group="demo">
      <div v-if="selectedPost === undefined" class="thumbnails">
        <a
          v-for="post in posts"
          :key="post.slug"
          @click="toggleExpanded(post.slug)"
        >
          <div
            v-shared-element="{
              id: post.slug,
              role: 'img',
            }"
            class="thumbnail"
            :style="`background-color: ${post.color};`"
          />
          <p
            v-shared-element="{
              id: post.slug,
              role: 'title',
            }"
          >
            {{ post.title }}
          </p>
        </a>
      </div>
      <div v-else class="post">
        <button class="close" @click="toggleExpanded">&times;</button>
        <div
          v-shared-element="{
            id: selectedPost.slug,
            role: 'img',
          }"
          class="header"
          :style="`background-color: ${selectedPost.color};`"
        />
        <h3
          v-shared-element="{
            id: selectedPost.slug,
            role: 'title',
          }"
        >
          {{ selectedPost.title }}
        </h3>
        <div class="text" v-html="selectedPost.content" />
      </div>
    </ContextualTransition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import posts from '../data/sampleData';
const expanded = ref<string | false>(false);

function toggleExpanded(slug: string | false) {
  if (slug !== false) {
    expanded.value = slug;
  } else {
    expanded.value = false;
  }
}

const selectedPost = computed(() => {
  return posts.find((p) => p.slug === expanded.value);
});
</script>

<style></style>
