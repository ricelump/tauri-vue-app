<script lang="ts" setup>
import type { Settings } from '~/types/settings'

const props = defineProps<{
	modelValue: Settings['locale']
}>()

const emit = defineEmits<{
	'update:modelValue': [value: Settings['locale']]
}>()

const { locale: currentLocale, locales, setLocale } = useI18n()

const model = computed({
	get() {
		return props.modelValue
	},
	set(val) {
		emit('update:modelValue', val)
		setLocale(val)
	},
})

const processedLocales = computed(() => {
	return locales.value.map((locale) => {
		let displayCode = locale.code.replace('_', '-')
		const localName = new Intl.DisplayNames([currentLocale.value.replace('_', '-')], {
			type: 'language',
			languageDisplay: 'dialect',
		}).of(displayCode)
		return {
			...locale,
			localName,
			avatar: {
				text: displayCode.split('-').pop()?.toUpperCase() || '',
			},
		}
	})
})
</script>

<template>
	<USelect
		v-model="model"
		:items="processedLocales"
		label-key="name"
		value-key="code"
		description-key="localName"
		:ui="{ itemLabel: 'text-sm', itemDescription: 'text-xs' }"
	/>
</template>
