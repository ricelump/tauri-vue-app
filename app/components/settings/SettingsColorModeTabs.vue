<script setup lang="ts">
const props = defineProps<{
	modelValue: 'light' | 'dark' | 'system'
}>()

const emit = defineEmits<{
	'update:modelValue': [value: 'light' | 'dark' | 'system']
}>()

const colorMode = useColorMode()

const tabValue = computed({
	get() {
		return props.modelValue
	},
	set(val) {
		emit('update:modelValue', val)
		colorMode.value = val
	},
})

const items = computed(() => [
	{
		value: 'light',
		label: $t('settings.items.colorMode.light'),
		icon: 'i-ph-sun',
	},
	{
		value: 'dark',
		label: $t('settings.items.colorMode.dark'),
		icon: 'i-ph-moon',
	},
	{
		value: 'system',
		label: $t('settings.items.colorMode.system'),
		icon: 'i-ph-monitor',
	},
])
</script>

<template>
	<UTabs v-model="tabValue" :content="false" :items="items" size="sm" class="w-auto" />
</template>
