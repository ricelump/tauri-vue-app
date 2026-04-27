<script setup lang="ts">
import type { ImagePreset, Preset } from '~/types/preset'

const props = defineProps<{
	type: 'image' | 'filename'
	preset?: Preset<ImagePreset> | null
}>()

const emit = defineEmits<{
	close: []
}>()

const isEdit = computed(() => !!props.preset)
const isImage = computed(() => props.type === 'image')

const editConfig = props.preset?.config as ImagePreset | undefined

const enableCompress = ref(
	isEdit.value ? editConfig?.format != null || editConfig?.quality != null : true,
)
const enableResize = ref(
	isEdit.value ? editConfig?.maxWidth != null || editConfig?.maxHeight != null : true,
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

		if (isEdit.value && props.preset)
			updateImagePreset(props.preset.id, { name: state.name, config: config as ImagePreset })
		else addImagePreset(state.name, config as ImagePreset)

		emit('close')
	} catch {
		toast.add({ title: $t('preset.failed'), color: 'error' })
	}
}
</script>

<template>
	<UModal :dismissible="false" :close="{ onClick: () => emit('close') }">
		<template #header>
			<span class="font-semibold">{{ isEdit ? $t('preset.edit') : $t('preset.add') }}</span>
		</template>

		<template #body>
			<UForm ref="formRef" :state="state" class="space-y-4" @submit="onSubmit">
				<UFormField :label="$t('preset.fields.name')" name="name" required>
					<UInput v-model="state.name" />
				</UFormField>
				<template v-if="isImage">
					<div class="space-y-3">
						<UCheckbox v-model="enableCompress" :label="$t('preset.options.compress')" />
						<div v-if="enableCompress" class="grid grid-cols-2 gap-4 pl-6">
							<UFormField :label="$t('preset.fields.format')" name="format">
								<USelect
									v-model="state.format"
									:items="['webp', 'jpeg', 'png', 'avif']"
									class="w-full"
								/>
							</UFormField>
							<UFormField :label="$t('preset.fields.quality')" name="quality">
								<UInput v-model="state.quality" type="number" :min="1" :max="100" />
							</UFormField>
						</div>
					</div>

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
			<UButton
				:label="$t('common.cancel')"
				color="neutral"
				variant="subtle"
				block
				@click="emit('close')"
			/>
			<UButton :label="$t('common.save')" block color="primary" @click="formRef?.submit()" />
		</template>
	</UModal>
</template>
