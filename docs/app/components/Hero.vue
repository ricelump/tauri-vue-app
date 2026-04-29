<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
	<div class="padding">
		<div class="flex flex-col">
			<h1 class="flex flex-col font-serif text-3xl font-semibold sm:text-4xl">
				<span class="text-primary">Drag. Optimize. Share.</span>
				<span class="text-toned">S3 bucket management, simplified.</span>
			</h1>
			<p class="mt-4 text-sm text-muted">
				{{ appConfig.app.description }}
			</p>
			<div class="mt-6 flex gap-2">
				<NuxtLink :to="`${appConfig.app.github}/releases`" target="_blank">
					<UButton label="Download for Windows" />
				</NuxtLink>
				<UButton :to="appConfig.app.github" target="_blank" label="GitHub" variant="subtle" />
			</div>
		</div>
	</div>
</template>
