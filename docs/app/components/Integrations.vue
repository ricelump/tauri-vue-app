<script setup lang="ts">
const providers = [
	{ name: 'Cloudflare', icon: 'logo:cloudflare', row: 0, col: 1 },
	{ name: 'Backblaze', icon: 'logo:backblaze', row: 1, col: 3 },
	{ name: 'MinIO', icon: 'logo:minio', row: 2, col: 0 },
	{ name: 'AWS', icon: 'logo:aws', row: 3, col: 2 },
]
</script>

<template>
	<div class="dash-bar border-y">
		<div class="grid h-full grid-cols-1 items-center border-y bg-default sm:grid-cols-2">
			<div class="padding flex flex-col gap-1">
				<h3 class="text-base font-medium sm:text-lg">
					Use your favorite provider, not just Amazon.
				</h3>
				<p class="text-sm text-muted">
					Connect to any S3-compatible storage, including Cloudflare R2, Backblaze B2, and more.
				</p>
			</div>

			<div class="relative ml-auto">
				<div
					class="relative"
					:style="{
						width: '160px',
						height: '160px',
						backgroundImage:
							'linear-gradient(to right, var(--border-color-default) 1px, transparent 1px), linear-gradient(to bottom, var(--border-color-default) 1px, transparent 1px)',
						backgroundSize: '40px 40px',
						maskImage: 'radial-gradient(ellipse at center, black, black, transparent)',
					}"
				>
					<div
						v-for="provider in providers"
						:key="provider.name"
						class="absolute flex items-center justify-center rounded bg-muted/50"
						:style="{
							left: `${provider.col * 40}px`,
							top: `${provider.row * 40}px`,
							width: '40px',
							height: '40px',
						}"
					>
						<UIcon :name="provider.icon" class="size-8" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
