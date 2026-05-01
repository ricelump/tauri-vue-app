<script setup lang="ts">
const providers = [
	{ name: 'Cloudflare', icon: 'logo:cloudflare', row: 0, col: 1 },
	{ name: 'Backblaze', icon: 'logo:backblaze', row: 1, col: 3 },
	{ name: 'MinIO', icon: 'logo:minio', row: 2, col: 0 },
	{ name: 'AWS', icon: 'logo:aws', row: 3, col: 2 },
]
</script>

<template>
	<div class="grid h-full grid-cols-1 items-center border-y bg-default sm:grid-cols-2">
		<div class="padding flex flex-col gap-1">
			<h3 class="text-base font-medium sm:text-lg">Use your favorite provider, not just Amazon.</h3>
			<p class="text-sm text-muted">
				Connect to any S3-compatible storage, including Cloudflare R2, Backblaze B2, and more.
			</p>
		</div>

		<div class="relative ml-auto h-full">
			<div
				class="relative size-40 h-full bg-[linear-gradient(to_right,var(--border-color-default)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-color-default)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black,black,transparent)] bg-size-[42px_42px]"
			>
				<div
					v-for="provider in providers"
					:key="provider.name"
					class="absolute flex size-[42px] items-center justify-center rounded bg-muted/50"
					:style="{
						left: `${provider.col * 42}px`,
						top: `${provider.row * 42}px`,
					}"
				>
					<UIcon :name="provider.icon" class="size-8" />
				</div>
			</div>
		</div>
	</div>
</template>
