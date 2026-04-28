/**
 * Fix: Tauri v2 production builds — WASM loading fails
 *
 * In production, assets are served via `http://tauri.localhost`. The WebView's
 * implementation of `fetch()` → `WebAssembly.instantiateStreaming()` breaks for
 * `.wasm` files despite returning HTTP 200.
 *
 * This plugin applies two patches (only inside Tauri):
 * 1. Replaces `fetch()` for `.wasm` URLs with `XMLHttpRequest`, which reliably
 *    returns an `ArrayBuffer` in Tauri's WebView.
 * 2. Overwrites `WebAssembly.instantiateStreaming` to always go through the
 *    `WebAssembly.instantiate(buffer)` fallback path, avoiding the streaming
 *    API that the WebView handles incorrectly.
 */
export default defineNuxtPlugin(() => {
	if (typeof window === 'undefined' || !('__TAURI_INTERNALS__' in window)) return

	// Patch fetch for .wasm URLs
	const originalFetch = globalThis.fetch.bind(globalThis)

	globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
		let url: string | undefined
		if (typeof input === 'string') url = input
		else if (input instanceof URL) url = input.href
		else if (input instanceof Request) url = input.url

		if (url?.endsWith('.wasm')) {
			return new Promise<Response>((resolve, reject) => {
				const xhr = new XMLHttpRequest()
				xhr.open('GET', url!)
				xhr.responseType = 'arraybuffer'
				xhr.onload = () => {
					if (xhr.status >= 200 && xhr.status < 300)
						resolve(
							new Response(xhr.response as ArrayBuffer, {
								status: xhr.status,
								statusText: xhr.statusText,
								headers: { 'Content-Type': 'application/wasm' },
							}),
						)
					else reject(new TypeError(`WASM fetch failed: ${xhr.status} ${url}`))
				}
				xhr.onerror = () => reject(new TypeError(`WASM fetch network error: ${url}`))
				xhr.send()
			})
		}

		return originalFetch(input, init)
	}) as typeof fetch

	// Force ArrayBuffer path for instantiateStreaming
	WebAssembly.instantiateStreaming = async (
		source: Response | PromiseLike<Response>,
		importObject?: WebAssembly.Imports,
	) => {
		const response = await source
		const buffer = await response.arrayBuffer()
		return WebAssembly.instantiate(buffer, importObject)
	}
})
