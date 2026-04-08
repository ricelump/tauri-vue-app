import { z } from 'zod'

export const bucketSchema = z.object({
	id: z.string().optional(),
	bucketName: z
		.string()
		.min(1)
		.regex(/^[a-z0-9-]+$/),
	displayName: z.string().optional(),
	endpoint: z.url(),
	region: z.string().min(1),
	accessKey: z.string().min(1),
	secretKey: z.string().min(1),
	publicUrl: z.url().optional().or(z.literal('')),
	createdAt: z.number().optional(),
})

export type Bucket = z.infer<typeof bucketSchema>
