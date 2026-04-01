import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

interface CryptoDB extends DBSchema {
	keys: {
		key: string
		value: ArrayBuffer
	}
}

const WEB_KEY_ID = 'master-key-v1'
const DB_NAME = 'prebucket-vault'
const DB_VERSION = 1

// TODO: rust side crypto support

export function useCrypto() {
	const initialized = ref(false)
	const error = ref<Error | null>(null)

	async function getWebKey(): Promise<CryptoKey> {
		const db: IDBPDatabase<CryptoDB> = await openDB(DB_NAME, DB_VERSION, {
			upgrade(db) {
				db.createObjectStore('keys')
			},
		})

		let keyBuffer = await db.get('keys', WEB_KEY_ID)

		if (!keyBuffer) {
			keyBuffer = crypto.getRandomValues(new Uint8Array(32)).buffer
			await db.put('keys', keyBuffer, WEB_KEY_ID)
		}

		return crypto.subtle.importKey('raw', keyBuffer, { name: 'AES-GCM', length: 256 }, false, [
			'encrypt',
			'decrypt',
		])
	}

	async function encryptWeb(plaintext: string): Promise<string> {
		const key = await getWebKey()
		const iv = crypto.getRandomValues(new Uint8Array(12))

		const encrypted = await crypto.subtle.encrypt(
			{ name: 'AES-GCM', iv },
			key,
			new TextEncoder().encode(plaintext),
		)

		const result = new Uint8Array(iv.length + encrypted.byteLength)
		result.set(iv)
		result.set(new Uint8Array(encrypted), iv.length)

		return `web:${btoa(String.fromCharCode(...result))}`
	}

	async function decryptWeb(ciphertext: string): Promise<string> {
		const key = await getWebKey()
		const data = Uint8Array.from(atob(ciphertext.replace(/^web:/, '')), (c) => c.charCodeAt(0))

		const iv = data.slice(0, 12)
		const payload = data.slice(12)

		try {
			const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, payload)
			return new TextDecoder().decode(decrypted)
		} catch {
			return ''
		}
	}

	async function encrypt(plaintext: string): Promise<string> {
		if (!plaintext) return ''

		try {
			initialized.value = true
			return await encryptWeb(plaintext)
		} catch (err) {
			error.value = err instanceof Error ? err : new Error('Encryption failed')
			throw error.value
		}
	}

	async function decrypt(ciphertext: string): Promise<string> {
		if (!ciphertext) return ''
		if (!ciphertext.match(/^(tauri|web):/)) return ciphertext

		try {
			return await decryptWeb(ciphertext)
		} catch (err) {
			error.value = err instanceof Error ? err : new Error('Decryption failed')
			return ''
		}
	}

	return { encrypt, decrypt }
}
