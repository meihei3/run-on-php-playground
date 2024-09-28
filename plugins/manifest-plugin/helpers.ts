import {execSync} from 'node:child_process';

type Version = {
	major: number;
	minor: number;
};

type VersionResult = {
	version: Version;
	versionName: string;
};

function getVersionFromGitTag(): VersionResult {
	const version = execSync('git describe --tags --abbrev=0').toString().trim();

	const match = /^v?(\d+)\.(\d+)/.exec(version);
	if (!match) {
		throw new Error('Invalid version format');
	}

	const major = Number.parseInt(match[1], 10);
	const minor = Number.parseInt(match[2], 10);
	const versionName = version;

	return {
		version: {major, minor},
		versionName,
	};
}

export {getVersionFromGitTag};
export type {VersionResult};
