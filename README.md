# Prebucket

Modern S3-compatible storage client built with Nuxt and Tauri. (WIP)

## Features

- **Multi-bucket Management** – Add, edit, delete, and switch between multiple S3 buckets
- **File Operations** – Drag & drop upload, download, rename, delete, batch delete, create folders
- **Image Presets** – Define optional compress (format/quality) and resize (max dimensions) rules
- **Auto Copy URL** – Optionally copy public URL to clipboard after file upload
- **Cross‑Platform** – Desktop (Tauri) and Web
- **i18n Ready** – Multi‑language support

## Development

```bash
pnpm i

# Web
pnpm dev
# Desktop
pnpm tauri dev
```

## Roadmap

- [ ] Search/filter files
- [ ] Filename presets (templates, timestamps)
- [ ] Delete/rename folder
- [ ] Upload from clipboard

## Acknowledgments

- [Tauri](https://tauri.app) - Desktop framework
- [Nuxt UI](https://ui.nuxt.com) - Vue component library
- [@jsquash](https://github.com/jamsinclair/jSquash) - WASM image codecs
- [AWS SDK for JavaScript](https://aws.amazon.com/sdk-for-javascript/)

## License

GNU Affero General Public License v3.0
