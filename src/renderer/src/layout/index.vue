<template>
    <div>
        <router-view></router-view>
    </div>
</template>


<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();

const navigate = (path: string) => {
    router.push(path);
}
</script>