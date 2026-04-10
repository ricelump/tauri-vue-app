<script setup lang="ts">
import type { ImagePreset, Preset } from '~/types/preset'

const props = defineProps<{
	type: 'image' | 'filename'
	preset?: Preset<ImagePreset> | null
}>()

const isEdit = computed(() => !!props.preset)

const isImage = computed(() => props.type === 'image')

const editConfig = props.preset?.config as ImagePreset | undefined

const enableCompress = ref(
	isEdit.value ? (editConfig?.format != null || editConfig?.quality != null) : true,
)
const enableResize = ref(
	isEdit.value ? (editConfig?.maxWidth != null || editConfig?.maxHeight != null) : true,
)

const state = reactive({
	name: props.preset?.name ?? '',
	...(isImage.value && {
		format: editConfig?.format ?? 'webp',
		quality: editConfig?.quality ?? 85,
		maxWidth: editConfig?.maxWidth ?? 1920,
		maxHeight: editConfig?.maxHeight ?? 1080,
	}),
})

const formRef = ref<{ submit: () => void }>()
const toast = useToast()
const { addImagePreset, updateImagePreset } = usePreset()
const overlay = useOverlay()
const modal = overlay.create(useTemplateRef('modalRef'))

async function onSubmit() {
	try {
		let config: ImagePreset | false = false

		if (isImage.value) {
			config = {}

			if (enableCompress.value) {
				config.format = state.format as ImagePreset['format']
				config.quality = Number(state.quality)
			}

			if (enableResize.value) {
				config.maxWidth = Number(state.maxWidth)
				config.maxHeight = Number(state.maxHeight)
			}
		}

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
					<!-- Compress toggle -->
					<div class="space-y-3">
						<UCheckbox v-model="enableCompress" :label="$t('preset.options.compress')" />
						<div v-if="enableCompress" class="grid grid-cols-2 gap-4 pl-6">
							<UFormField :label="$t('preset.fields.format')" name="format">
								<USelect v-model="state.format" :items="['webp', 'jpeg', 'png', 'avif']" />
							</UFormField>
							<UFormField :label="$t('preset.fields.quality')" name="quality">
								<UInput v-model="state.quality" type="number" :min="1" :max="100" />
							</UFormField>
						</div>
					</div>

					<!-- Resize toggle -->
					<div class="space-y-3">
						<UCheckbox v-model="enableResize" :label="$t('preset.options.resize')" />
						<div v-if="enableResize" class="grid grid-cols-2 gap-4 pl-6">
							<UFormField :label="$t('preset.fields.maxWidth')" name="maxWidth">
								<UInput v-model="state.maxWidth" type="number" :min="1" />
							</UFormField>
							<UFormField :label="$t('preset.fields.maxHeight')" name="maxHeight">
								<UInput v-model="state.maxHeight" type="number" :min="1" />
							</UFormField>
						</div>
					</div>
				</template>
			</UForm>
		</template>
		<template #footer>
			<UButton :label="$t('common.save')" loading-auto @click="formRef?.submit()" />
		</template>
	</ResponsiveModal>
</template>
