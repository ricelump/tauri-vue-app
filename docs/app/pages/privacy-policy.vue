<script setup lang="ts">
const appConfig = useAppConfig()

useSeoMeta({
	title: 'Privacy Policy',
})
</script>

<template>
	<div class="padding text-sm">
		<h1 class="font-serif text-3xl font-semibold sm:text-4xl">Privacy Policy</h1>
		<p class="mt-2 mb-6 text-muted">Last updated: May 1, 2026</p>

		<ProseH2>Information We Collect</ProseH2>
		<ProseP>
			We do not collect, store, or transmit any personal information. The App operates locally on
			your device with no analytics, crash reporting, or telemetry.
		</ProseP>
		<ProseUl>
			<ProseLi>
				<strong>S3 credentials</strong> (access key, secret key, endpoint, bucket name) are stored
				only on your device.
			</ProseLi>
			<ProseLi>
				<strong>Files and folders</strong> you interact with are transferred directly between your
				device and your chosen S3-compatible storage provider (e.g., AWS S3, MinIO, Cloudflare R2).
			</ProseLi>
		</ProseUl>

		<ProseH2>How Your Information Is Used</ProseH2>
		<ProseP>We don't collect personal information, so we don't use your data.</ProseP>

		<ProseH2>Sharing of Information</ProseH2>
		<ProseP>
			We do not share any information with third parties. All communication occurs exclusively
			between your device and your S3 provider. Please review the privacy policy of your chosen S3
			provider for how they handle your data.
		</ProseP>

		<ProseH2>Your Rights and Control</ProseH2>
		<ProseP>
			Since we hold no personal data, you retain full control. You can delete your credentials and
			any cached data from within the app settings or by uninstalling.
		</ProseP>

		<ProseH2>Children's Privacy</ProseH2>
		<ProseP>
			We do not knowingly collect any information from children under 13 (or the equivalent age in
			your jurisdiction).
		</ProseP>

		<ProseH2>Changes</ProseH2>
		<ProseP>
			We may update this Privacy Policy from time to time. Any changes will be posted on this page
			(and, if significant, through the project's GitHub repository).
		</ProseP>

		<ProseH2>Contact</ProseH2>
		<ProseP>
			If you have any questions about this Privacy Policy, you can reach us through
			<ProseA :href="`${appConfig.app.github}/issues`">GitHub Issues</ProseA> or email us at
			<ProseA :href="`mailto:${appConfig.app.mail}`">{{ appConfig.app.mail }}</ProseA>
		</ProseP>
	</div>
</template>
