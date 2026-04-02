<script setup lang="ts">
import { LazyBucketConfigModal, LazySettingsModal } from '#components'
import type { DropdownMenuItem } from '@nuxt/ui'

const { buckets, currentBucket, hasBuckets, selectBucket } = useBuckets()
const overlay = useOverlay()
const addBucketModal = overlay.create(LazyBucketConfigModal)
const settingsModal = overlay.create(LazySettingsModal)

const items = computed<DropdownMenuItem[]>(() => [
	...buckets.value.map((bucket) => ({
		label: bucket.bucketName,
		value: bucket.id,
		avatar: { alt: bucket.bucketName.toUpperCase() },
		type: 'checkbox' as const,
		checked: bucket.id === currentBucket.value?.id,
		onUpdateChecked() {
			selectBucket(bucket.id)
		},
		onSelect(e: Event) {
			e.preventDefault()
		},
	})),
	{
		type: 'separator',
	},
	{
		label: $t('bucket.add'),
		icon: 'i-ph-plus',
		onClick: () => addBucketModal.open(),
	},
	{
		label: $t('bucket.manage'),
		icon: 'i-ph-cube',
		onClick: () => settingsModal.open(),
	},
])
</script>

<template>
	<UDropdownMenu :items="items" :ui="{ content: 'min-w-48' }">
		<UButton
			:label="currentBucket?.bucketName || $t('bucket.select')"
			color="neutral"
			variant="ghost"
			trailing-icon="i-ph-caret-up-down"
			:ui="{ trailingIcon: 'text-muted size-4' }"
		/>
	</UDropdownMenu>
</template>
