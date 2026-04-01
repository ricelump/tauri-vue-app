import { S3Client, HeadBucketCommand } from '@aws-sdk/client-s3'
import type { Bucket } from '~/types/bucket'

export function useS3(bucketRef?: Ref<Bucket | null>) {
	const client = ref<S3Client | null>(null)
	const testing = ref(false)
	const uploading = ref(false)
	const error = ref<string | null>(null)

	function createClient(bucket: Bucket): S3Client {
		return new S3Client({
			region: bucket.region,
			endpoint: bucket.endpoint,
			credentials: {
				accessKeyId: bucket.accessKey,
				secretAccessKey: bucket.secretKey,
			},
			forcePathStyle: true,
		})
	}

	function getClient(): S3Client | null {
		if (client.value) return client.value
		if (!bucketRef?.value) return null

		client.value = createClient(bucketRef.value)
		return client.value
	}

	async function test(targetBucket?: Bucket): Promise<boolean> {
		const bucket = targetBucket || bucketRef?.value
		if (!bucket) {
			error.value = 'No bucket configured'
			return false
		}

		testing.value = true
		error.value = null

		try {
			const s3 = createClient(bucket)
			await s3.send(
				new HeadBucketCommand({
					Bucket: bucket.bucketName,
				}),
			)

			// update client if test succeeded
			if (!targetBucket && bucketRef?.value === bucket) client.value = s3

			return true
		} catch (err: any) {
			error.value = err.message || 'Connection failed'
			return false
		} finally {
			testing.value = false
		}
	}

	// reset bucket
	if (bucketRef) {
		watch(
			bucketRef,
			() => {
				client.value = null
			},
			{ deep: true },
		)
	}

	return {
		client: readonly(client),
		testing: readonly(testing),
		uploading: readonly(uploading),
		error: readonly(error),
		test,
		getClient,
	}
}
