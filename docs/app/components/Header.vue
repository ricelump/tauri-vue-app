<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
	<header class="padding border-b border-default bg-muted/50 dark:bg-muted/10">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-1 text-toned">
				<span class="font-medium">{{ appConfig.app.name }}</span>
				<UBadge label="Beta" color="neutral" variant="subtle" size="sm" />
			</div>
			<AppIconLinear class="-mt-1.5 size-6 text-toned" />
		</div>
	</header>
</template>
