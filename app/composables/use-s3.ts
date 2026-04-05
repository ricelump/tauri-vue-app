import { S3Client, HeadBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3'
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

	async function upload(
		key: string,
		body: Blob | File | Buffer,
		contentType?: string,
	): Promise<boolean> {
		const s3 = getClient()
		const bucket = bucketRef?.value
		if (!s3 || !bucket) return false

		uploading.value = true
		error.value = null

		try {
			let bodyData: Uint8Array

			if (body instanceof Blob || body instanceof File) {
				const arrayBuffer = await body.arrayBuffer()
				bodyData = new Uint8Array(arrayBuffer)
			} else bodyData = new Uint8Array(body)

			await s3.send(
				new PutObjectCommand({
					Bucket: bucket.bucketName,
					Key: key,
					Body: bodyData,
					ContentType:
						contentType ||
						(body instanceof Blob ? body.type : undefined) ||
						'application/octet-stream',
				}),
			)

			return true
		} catch (err: any) {
			error.value = err.message || 'Upload failed'
			return false
		} finally {
			uploading.value = false
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
		upload,
		getClient,
	}
}
