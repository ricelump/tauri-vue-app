<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Bucket } from '~/types/bucket'

const props = defineProps<{
	bucket?: Bucket | null
}>()

const isEdit = computed(() => !!props.bucket)

const state = reactive<Partial<Bucket>>({
	bucketName: props.bucket?.bucketName ?? undefined,
	displayName: props.bucket?.displayName ?? undefined,
	endpoint: props.bucket?.endpoint ?? undefined,
	region: props.bucket?.region ?? 'auto',
	accessKey: props.bucket?.accessKey ?? undefined,
	secretKey: props.bucket?.secretKey ?? undefined,
	publicUrl: props.bucket?.publicUrl ?? undefined,
})

const formRef = ref<{ submit: () => void; validate: () => Promise<{ valid: boolean }> }>()
const toast = useToast()
const { test } = useS3()
const { addBucket, updateBucket } = useBuckets()
const overlay = useOverlay()
const modal = overlay.create(useTemplateRef('modalRef'))

async function handleTest() {
	const result = await test(state as Bucket)
	toast.add({
		title: result ? 'Connection Successful' : 'Connection Failed',
		color: result ? 'success' : 'error',
	})
}

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

		if (isEdit.value && props.bucket) {
			await updateBucket(props.bucket.id!, event.data)
			toast.add({
				title: 'Bucket updated successfully',
				color: 'success',
			})
		} else {
			await addBucket(event.data)
			toast.add({
				title: 'Bucket added successfully',
				color: 'success',
			})
		}

		modal.close()
	} catch (err) {
		toast.add({
			title: isEdit.value ? 'Failed to update bucket' : 'Failed to save bucket',
			color: 'error',
		})
	}
}

function open() {
	modal.open()
}

defineExpose({ open })
</script>

<template>
	<ResponsiveModal ref="modalRef" :title="isEdit ? $t('bucket.edit') : $t('bucket.add')">
		<template #body>
			<UForm ref="formRef" :state="state" class="space-y-4" @submit="onSubmit">
				<UFormField :label="$t('bucket.fields.bucketName')" name="bucketName" required>
					<UInput v-model="state.bucketName" placeholder="Bucket Name..." />
				</UFormField>
				<UFormField :label="$t('bucket.fields.displayName')" name="displayName">
					<UInput v-model="state.displayName" placeholder="Display Name..." />
				</UFormField>
				<UFormField :label="$t('bucket.fields.endpoint')" name="endpoint" required>
					<UInput v-model="state.endpoint" placeholder="Endpoint..." type="url" />
				</UFormField>
				<UFormField :label="$t('bucket.fields.region')" name="region" required>
					<UInput v-model="state.region" placeholder="Region..." />
				</UFormField>
				<UFormField :label="$t('bucket.fields.accessKey')" name="accessKey" required>
					<UInput v-model="state.accessKey" placeholder="Access Key ID..." type="password" />
				</UFormField>
				<UFormField :label="$t('bucket.fields.secretKey')" name="secretKey" required>
					<UInput v-model="state.secretKey" placeholder="Secret Access Key..." type="password" />
				</UFormField>
				<UFormField :label="$t('bucket.fields.publicUrl')" name="publicUrl">
					<UInput v-model="state.publicUrl" placeholder="Public URL..." type="url" />
				</UFormField>
			</UForm>
		</template>
		<template #footer>
			<UButton
				:label="$t('common.test')"
				color="neutral"
				variant="subtle"
				loading-auto
				@click="handleTest"
			/>
			<UButton :label="$t('common.save')" loading-auto @click="formRef?.submit()" />
		</template>
	</ResponsiveModal>
</template>
