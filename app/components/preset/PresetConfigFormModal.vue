<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { ImagePreset, Preset } from '~/types/preset'

const props = defineProps<{
	type: 'image' | 'filename'
	preset?: Preset<ImagePreset> | null
}>()

const isEdit = computed(() => !!props.preset)

const isImage = computed(() => props.type === 'image')

const state = reactive({
	name: props.preset?.name ?? '',
	...(isImage.value && {
		format: (props.preset?.config as ImagePreset)?.format ?? 'webp',
		quality: (props.preset?.config as ImagePreset)?.quality ?? 85,
		maxWidth: (props.preset?.config as ImagePreset)?.maxWidth ?? 1920,
		maxHeight: (props.preset?.config as ImagePreset)?.maxHeight ?? 1080,
	}),
})

const formRef = ref<{ submit: () => void }>()
const toast = useToast()
const { addImagePreset, updateImagePreset } = usePreset()
const overlay = useOverlay()
const modal = overlay.create(useTemplateRef('modalRef'))

async function onSubmit() {
	try {
		const config =
			isImage.value &&
			({
				format: state.format,
				quality: state.quality,
				maxWidth: state.maxWidth,
				maxHeight: state.maxHeight,
			} as ImagePreset)

		if (isEdit.value && props.preset) {
			if (isImage.value)
				updateImagePreset(props.preset.id, { name: state.name, config: config as ImagePreset })

			toast.add({ title: 'Preset updated', color: 'success' })
		} else {
			if (isImage.value) addImagePreset(state.name, config as ImagePreset)

			toast.add({ title: 'Preset created', color: 'success' })
		}

		modal.close()
	} catch {
		toast.add({ title: 'Failed to save preset', color: 'error' })
	}
}

function open() {
	modal.open()
}

defineExpose({ open })
</script>

<template>
	<ResponsiveModal ref="modalRef" :title="isEdit ? $t('preset.edit') : $t('preset.add')">
		<template #body>
			<UForm ref="formRef" :state="state" class="space-y-4" @submit="onSubmit">
				<UFormField :label="$t('preset.fields.name')" name="name" required>
					<UInput v-model="state.name" />
				</UFormField>
				<template v-if="isImage">
					<div class="grid grid-cols-2 gap-4">
						<UFormField :label="$t('preset.fields.format')" name="format" required>
							<USelect v-model="state.format" :items="['webp', 'jpeg', 'png', 'avif']" />
						</UFormField>
						<UFormField :label="$t('preset.fields.quality')" name="quality" required>
							<UInput v-model="state.quality" type="number" />
						</UFormField>
						<UFormField :label="$t('preset.fields.maxWidth')" name="maxWidth" required>
							<UInput v-model="state.maxWidth" type="number" />
						</UFormField>
						<UFormField :label="$t('preset.fields.maxHeight')" name="maxHeight" required>
							<UInput v-model="state.maxHeight" type="number" />
						</UFormField>
						<!-- <UFormField :label="$t('preset.fields.fit')" name="fit" required>
							<USelect v-model="state.fit" :items="['inside', 'outside', 'cover', 'contain']" />
						</UFormField> -->
					</div>
				</template>
			</UForm>
		</template>
		<template #footer>
			<UButton :label="$t('common.save')" loading-auto @click="formRef?.submit()" />
		</template>
	</ResponsiveModal>
</template>
