<template>
	<ResponsiveModal :title="$t('bucket.add')">
		<template #body="{ close }">
			<BucketConfigForm @saved="close" />
		</template>
	</ResponsiveModal>
</template>
