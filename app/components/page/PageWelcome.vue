<script setup lang="ts">
import { LazyBucketConfigModal } from '#components'

const appConfig = useAppConfig()
const overlay = useOverlay()

const modal = overlay.create(LazyBucketConfigModal)
</script>

<template>
	<div class="flex size-full items-center justify-center">
		<div class="flex flex-col items-start justify-start">
			<AppIconLinear class="size-16 text-primary" />
			<h1 class="mt-6 flex flex-col text-2xl sm:text-3xl">
				<span class="text-toned">
					{{ $t('pages.welcome.title') }}
				</span>
				<span class="font-bold">
					{{ appConfig.app.name }}
				</span>
			</h1>
			<p class="my-4 max-w-xl text-sm text-muted sm:text-base">
				{{ $t('pages.welcome.description') }}
			</p>
			<UButton :label="$t('bucket.add')" icon="i-ph-plus" @click="modal.open" />
		</div>
	</div>
</template>
