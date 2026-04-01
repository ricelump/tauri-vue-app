<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

const state = reactive({
	bucketName: undefined,
	endpoint: undefined,
	region: undefined,
	accessKey: undefined,
	secretKey: undefined,
	publicUrl: undefined,
})

type Schema = typeof state

const form = useTemplateRef('form')

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
	toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
	console.log(event.data)
}
</script>

<template>
	<div class="space-y-4">
		<UForm ref="form" :state="state" class="space-y-4" @submit="onSubmit">
			<UFormField :label="$t('bucket.fields.bucketName')" name="bucketName">
				<UInput v-model="state.bucketName" placeholder="my-bucket" type="url" required />
			</UFormField>
			<UFormField :label="$t('bucket.fields.endpoint')" name="endpoint">
				<UInput v-model="state.endpoint" placeholder="Endpoint..." required />
			</UFormField>
			<UFormField :label="$t('bucket.fields.region')" name="region">
				<UInput v-model="state.region" placeholder="auto" required />
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
				<UInput v-model="state.publicUrl" placeholder="https://pub-xxx.r2.dev" type="url" />
			</UFormField>
		</UForm>

		<UButton
			:label="$t('common.save')"
			icon="i-ph-floppy-disk"
			class="mt-auto"
			@click="form?.submit()"
		/>
	</div>
</template>
