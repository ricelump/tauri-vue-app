<script setup lang="ts">
import { LazyBucketConfigFormModal } from '#components'
import type { Bucket } from '~/types/bucket'

const { buckets, removeBucket, selectBucket, currentBucket } = useBuckets()
const toast = useToast()
const overlay = useOverlay()
const editModal = overlay.create(LazyBucketConfigFormModal)

async function handleEdit(bucket: Bucket) {
	editModal.open({ bucket })
}

async function handleDelete(bucket: Bucket) {
	const confirmed = await openConfirmDialog({
		title: `Delete "${bucket.displayName || bucket.bucketName}"?`,
		description:
			'This action cannot be undone. The bucket configuration will be permanently removed.',
		destructive: true,
	})
	if (!confirmed) return

	await removeBucket(bucket.id!)
	if (currentBucket.value?.id === bucket.id) selectBucket(null)

	toast.add({
		title: 'Bucket removed successfully',
		color: 'success',
	})
}
</script>

<template>
	<SettingsItem
		v-for="bucket in buckets"
		:key="bucket.id"
		:label="bucket.displayName || bucket.bucketName"
		:description="bucket.endpoint"
	>
		<div class="flex gap-0.5">
			<UButton
				icon="i-ph-pencil-simple"
				color="neutral"
				variant="ghost"
				@click="handleEdit(bucket)"
			/>
			<UButton icon="i-ph-trash" color="error" variant="ghost" @click="handleDelete(bucket)" />
		</div>
	</SettingsItem>
</template>
