<script setup lang="ts">
const appConfig = useAppConfig()

useSeoMeta({
	titleTemplate: '%s',
})
</script>

<template>
	<Hero />
	<Screenshot />
	<Features />
</template>
