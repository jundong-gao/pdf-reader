<template>
    <div>{{ file }}</div>
</template>


<script setup lang="ts">
let props = defineProps<{file: File}>()
</script>