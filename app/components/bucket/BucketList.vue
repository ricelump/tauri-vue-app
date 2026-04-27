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
		title: $t('bucket.delete.title', { name: bucket.displayName || bucket.bucketName }),
		description: $t('bucket.delete.description'),
		destructive: true,
	})
	if (!confirmed) return

	await removeBucket(bucket.id!)
	if (currentBucket.value?.id === bucket.id) selectBucket(null)
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
			<UTooltip :text="$t('bucket.edit')">
				<UButton
					icon="i-ph-pencil-simple"
					color="neutral"
					variant="ghost"
					@click="handleEdit(bucket)"
				/>
			</UTooltip>
			<UTooltip :text="$t('bucket.delete.label')">
				<UButton icon="i-ph-trash" color="error" variant="ghost" @click="handleDelete(bucket)" />
			</UTooltip>
		</div>
	</SettingsItem>
</template>
