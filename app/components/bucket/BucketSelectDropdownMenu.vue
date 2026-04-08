<script setup lang="ts">
import { LazyBucketConfigFormModal, LazySettingsModal } from '#components'
import type { DropdownMenuItem } from '@nuxt/ui'

const { buckets, currentBucket, selectBucket } = useBuckets()
const overlay = useOverlay()
const addBucketModal = overlay.create(LazyBucketConfigFormModal)
const settingsModal = overlay.create(LazySettingsModal)

const items = computed<DropdownMenuItem[]>(() => [
	...buckets.value.map((bucket) => ({
		label: bucket.displayName ?? bucket.bucketName,
		value: bucket.id,
		avatar: { alt: bucket.displayName?.toUpperCase() ?? bucket.bucketName.toUpperCase() },
		type: 'checkbox' as const,
		checked: bucket.id === currentBucket.value?.id,
		onUpdateChecked() {
			selectBucket(bucket.id!)
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
		icon: 'i-ph-hard-drives',
		onClick: () => settingsModal.open({ activeTab: 'buckets' }),
	},
])
</script>

<template>
	<UDropdownMenu :items="items" :ui="{ content: 'min-w-48' }">
		<UButton
			:label="currentBucket?.displayName || currentBucket?.bucketName || $t('bucket.select')"
			color="neutral"
			variant="ghost"
			trailing-icon="i-ph-caret-up-down"
			:ui="{ trailingIcon: 'text-muted size-4' }"
		/>
	</UDropdownMenu>
</template>
