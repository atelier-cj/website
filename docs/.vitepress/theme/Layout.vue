<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData, useRouter } from 'vitepress'
import { nextTick, onMounted, watch } from 'vue'
import Landing from './Landing.vue'
import { bindNavGroupLinks } from './nav-group-link'

const { frontmatter, page } = useData()
const router = useRouter()

function bind() {
  nextTick(() => bindNavGroupLinks((href) => router.go(href)))
}

watch(() => page.value.relativePath, bind, { immediate: true })
onMounted(bind)
</script>

<template>
  <Landing v-if="frontmatter.layout === 'landing'" />
  <DefaultTheme.Layout v-else />
</template>
