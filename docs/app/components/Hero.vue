<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
	<div class="padding">
		<div class="flex flex-col">
			<h1 class="flex flex-col font-serif text-3xl font-semibold sm:text-4xl">
				<span class="text-primary">Drag. Optimize. Share.</span>
				<span class="text-highlighted">S3 bucket management, simplified.</span>
			</h1>
			<p class="mt-4 text-sm text-muted">
				{{ appConfig.app.description }}
			</p>
			<Actions />
		</div>
	</div>
</template>
