const storageKeys = {
	selectedVersion: 'selectedPhpVersion',
} as const;

export type StorageData = {
	selectedPhpVersion?: string;
};

export async function getSelectedVersion(): Promise<string | undefined> {
	try {
		const result = await chrome.storage.local.get([storageKeys.selectedVersion]);
		return result[storageKeys.selectedVersion] as string | undefined;
	} catch (error) {
		console.error('Failed to get selected version from storage:', error);
		return undefined;
	}
}

export async function setSelectedVersion(version: string): Promise<void> {
	try {
		await chrome.storage.local.set({
			[storageKeys.selectedVersion]: version,
		});
	} catch (error) {
		console.error('Failed to save selected version to storage:', error);
	}
}

export async function clearSelectedVersion(): Promise<void> {
	try {
		await chrome.storage.local.remove([storageKeys.selectedVersion]);
	} catch (error) {
		console.error('Failed to clear selected version from storage:', error);
	}
}
