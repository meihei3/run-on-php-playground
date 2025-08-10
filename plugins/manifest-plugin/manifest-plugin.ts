import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {type Plugin} from 'vite';
import {getVersionFromGitTag, type VersionResult} from './helpers.ts';

function manifestPlugin(
	inputManifestFilename = 'src/manifest.json',
	outputManifestFilename = 'dist/manifest.json',
	v: VersionResult = getVersionFromGitTag(),
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

			let manifest = String(fs.readFileSync(inputPath, 'utf8'));

			// テンプレートの置換
			manifest = manifest.replaceAll('__VERSION__', `${v.version.major}.${v.version.minor}`);
			manifest = manifest.replaceAll('__VERSION_NAME__', v.versionName.replace(/^v/, ''));

			// Manifest.json の出力
			fs.writeFileSync(outputPath, manifest, 'utf8');
		},
	};
}

export {manifestPlugin};
