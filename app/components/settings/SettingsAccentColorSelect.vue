<script lang="ts" setup>
import type { ArrayOrNested, SelectItem } from '@nuxt/ui'

const props = defineProps<{
	modelValue: string
}>()

const emit = defineEmits<{
	'update:modelValue': [value: string]
}>()

const appConfig = useAppConfig()

const model = computed({
	get() {
		return props.modelValue
	},
	set(val) {
		emit('update:modelValue', val)
		appConfig.ui.colors.primary = val
	},
})

const colors: ArrayOrNested<SelectItem> = [
	{ label: $t('settings.appearance.accentColor.blue'), value: 'blue', chip: { color: 'info' } },
	{
		label: $t('settings.appearance.accentColor.teal'),
		value: 'teal',
		chip: { color: 'secondary' },
	},
	{
		label: $t('settings.appearance.accentColor.green'),
		value: 'emerald',
		chip: { color: 'success' },
	},
	{
		label: $t('settings.appearance.accentColor.yellow'),
		value: 'amber',
		chip: { color: 'warning' },
	},
	{ label: $t('settings.appearance.accentColor.red'), value: 'rose', chip: { color: 'error' } },
	{
		label: $t('settings.appearance.accentColor.neutral'),
		value: 'neutral',
		chip: { color: 'neutral' },
	},
]
</script>

<template>
	<USelect v-model="model" :items="colors" />
</template>
