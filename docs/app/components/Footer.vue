<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
	<footer class="padding border-t border-default bg-muted/50 dark:bg-muted/10">
		<div class="flex items-center justify-between">
			<p class="flex items-center gap-1 text-xs font-medium text-muted">
				{{ `© ${new Date().getFullYear()} ${appConfig.app.name}` }}
			</p>
		</div>
	</footer>
</template>
