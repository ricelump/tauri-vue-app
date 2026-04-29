<script setup lang="ts">
const features = [
	{
		name: 'Multi‑Bucket at a Glance.',
		description: 'Add all your S3 buckets and switch between them instantly.',
		icon: 'icon:table',
	},
	{
		name: 'Automatically Copy URL.',
		description: 'After upload, the URL can be copied to your clipboard automatically.',
		icon: 'icon:link',
	},
	{
		name: 'Image Preprocessing.',
		description: 'Define custom presets for image compression and format conversion.',
		icon: 'icon:image-edit',
	},
]
</script>

<template>
	<div class="padding flex flex-col gap-2">
		<h2 class="flex gap-1 font-serif text-2xl font-semibold sm:text-3xl">
			<span class="text-highlighted">Features.</span>
			<span class="text-toned">All in one intuitive app.</span>
		</h2>
		<p class="text-sm text-muted">
			Prebucket integrates multi-bucket management, drag-and-drop batch operations, and preset image
			preprocessing.
		</p>
	</div>

	<Integrations />

	<div class="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
		<div v-for="feature in features" :key="feature.name" class="padding flex flex-col bg-default">
			<UIcon :name="feature.icon" class="size-8 text-highlighted" />
			<h3 class="mt-2 text-base font-medium sm:text-lg">{{ feature.name }}</h3>
			<p class="mt-1 text-sm text-muted">{{ feature.description }}</p>
		</div>
		<div class="hidden items-center justify-center bg-muted sm:flex">
			<p class="text-sm text-muted">And there's more cooking</p>
		</div>
	</div>
</template>
