<script setup lang="ts">
import appIcon from '~/assets/icon.svg'

const version = isTauri ? await useTauriAppGetVersion() : 'Web'

const appConfig = useAppConfig()
</script>

<template>
	<div class="flex size-full flex-col gap-4">
		<div class="flex flex-col items-center justify-center gap-4 py-6">
			<img :src="appIcon" class="size-16 lg:size-24" />
			<div class="flex flex-col items-center justify-center gap-2">
				<p class="text-xl font-semibold lg:text-2xl">{{ appConfig.app.name }}</p>
				<span class="text-sm text-muted">{{ version }}</span>
				<span class="text-xs text-dimmed">© {{ new Date().getFullYear() }}</span>
			</div>
		</div>

		<SettingsItem :label="$t('settings.about.github')" icon="i-ph-github-logo-duotone">
			<UButton
				icon="i-ph-arrow-square-out"
				:to="appConfig.app.github"
				target="_blank"
				color="neutral"
				variant="ghost"
			/>
		</SettingsItem>
	</div>
</template>
