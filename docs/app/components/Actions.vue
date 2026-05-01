<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
	<div class="mt-6 flex gap-2">
		<NuxtLink :to="`${appConfig.app.github}/releases`" target="_blank">
			<UButton label="Download for Windows" />
		</NuxtLink>
		<UButton :to="appConfig.app.github" target="_blank" label="GitHub" variant="subtle" />
	</div>
</template>
