<script lang="ts" setup>
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

const colors = [
	{ label: $t('settings.items.accentColor.blue'), value: 'blue', chip: { color: 'info' } },
	{ label: $t('settings.items.accentColor.teal'), value: 'teal', chip: { color: 'secondary' } },
	{ label: $t('settings.items.accentColor.green'), value: 'emerald', chip: { color: 'success' } },
	{ label: $t('settings.items.accentColor.yellow'), value: 'amber', chip: { color: 'warning' } },
	{ label: $t('settings.items.accentColor.red'), value: 'rose', chip: { color: 'error' } },
	{ label: $t('settings.items.accentColor.neutral'), value: 'neutral', chip: { color: 'neutral' } },
]
</script>

<template>
	<USelect v-model="model" :items="colors" />
</template>
