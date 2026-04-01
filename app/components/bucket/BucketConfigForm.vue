<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Bucket } from '~/types/bucket'

const emit = defineEmits<{ (e: 'saved'): void }>()

const state = reactive<Partial<Bucket>>({
	bucketName: undefined,
	endpoint: undefined,
	region: 'auto',
	accessKey: undefined,
	secretKey: undefined,
	publicUrl: undefined,
})

const form = useTemplateRef('form')
const toast = useToast()
const { test } = useS3()
const { addBucket } = useBuckets()

async function onSubmit(event?: FormSubmitEvent<Bucket>) {
	if (!event) return
	try {
		const result = await test(event.data)
		if (!result) {
			toast.add({
				title: 'Connection Failed',
				color: 'error',
			})
			return
		}

		await addBucket(event.data)
		toast.add({
			title: 'Created',
			description: 'Bucket added successfully',
			color: 'success',
		})

		emit('saved')
	} catch (err) {
		toast.add({
			title: 'Error',
			description: 'Failed to save bucket',
			color: 'error',
		})
	}
}
</script>

<template>
	<div class="space-y-4">
		<UForm ref="form" :state="state" class="space-y-4" @submit="onSubmit">
			<UFormField :label="$t('bucket.fields.bucketName')" name="bucketName">
				<UInput v-model="state.bucketName" placeholder="Bucket Name..." required />
			</UFormField>
			<UFormField :label="$t('bucket.fields.endpoint')" name="endpoint">
				<UInput v-model="state.endpoint" placeholder="Endpoint..." type="url" required />
			</UFormField>
			<UFormField :label="$t('bucket.fields.region')" name="region">
				<UInput v-model="state.region" placeholder="Region..." required />
			</UFormField>
			<UFormField :label="$t('bucket.fields.accessKey')" name="accessKey">
				<UInput v-model="state.accessKey" placeholder="Access Key ID..." type="password" required />
			</UFormField>
			<UFormField :label="$t('bucket.fields.secretKey')" name="secretKey">
				<UInput
					v-model="state.secretKey"
					placeholder="Secret Access Key..."
					type="password"
					required
				/>
			</UFormField>
			<UFormField :label="$t('bucket.fields.publicUrl')" name="publicUrl">
				<UInput v-model="state.publicUrl" placeholder="Public URL..." type="url" />
			</UFormField>
		</UForm>

		<UButton
			:label="$t('common.save')"
			icon="i-ph-floppy-disk"
			class="mt-auto"
			loading-auto
			@click="form?.submit()"
		/>
	</div>
</template>
