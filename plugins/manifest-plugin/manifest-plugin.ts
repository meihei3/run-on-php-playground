import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {type Plugin} from 'vite';
import {getVersionFromGitTag} from './helpers.ts';

function replace(manifest: string): string {
	const v = getVersionFromGitTag();

	manifest = manifest.replace(/"version":\s*"__VERSION__"/, `"version": "${v.version.major}.${v.version.minor}"`);
	manifest = manifest.replace(/"version_name":\s*"__VERSION_NAME__"/, `"version_name": "${v.versionName.replace(/^v/, '')}"`);

	return manifest;
}

function manifestPlugin(
	inputManifestFilename = 'src/manifest.json',
	outputManifestFilename = 'dist/manifest.json',
): Plugin {
	return {
		name: 'manifest-plugin',
		generateBundle() {
			// パスの設定
			const inputPath = path.resolve(process.cwd(), inputManifestFilename);
			const outputPath = path.resolve(process.cwd(), outputManifestFilename);

			// Manifest.template.json の読み込み
			if (!fs.existsSync(inputPath)) {
				throw new Error('manifest.template.json not found');
			}

			let manifest = fs.readFileSync(inputPath, 'utf8');

			// メインの処理
			manifest = replace(manifest);

			// Manifest.json の出力
			fs.writeFileSync(outputPath, manifest, 'utf8');
		},
	};
}

export {manifestPlugin};
