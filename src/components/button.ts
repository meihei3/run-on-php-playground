import {css} from '@linaria/core';
import {getSelectedVersion, setSelectedVersion} from '../utils/storage.ts';

const defaultText = 'Run on Playground';
const defaultLink = 'https://php-play.dev/';
const baseUrl = 'https://php-play.dev/';

const phpVersions = [
	{name: 'PHP 8.4', value: '8.4', isDefault: true},
	{name: 'PHP 8.3', value: '8.3'},
	{name: 'PHP 8.2', value: '8.2'},
	{name: 'PHP 8.1', value: '8.1'},
	{name: 'PHP 8.0', value: '8.0'},
	{name: 'PHP 7.4', value: '7.4'},
];

// Helper function to find version by value
function findPhpVersion(value: string) {
	return phpVersions.find(version => version.value === value);
}

const containerStyles: string = css`
	position: absolute;
	right: 0;
	top: 0;
	display: inline-flex;
	border-radius: 6px;
	overflow: visible;
	box-shadow: rgba(27, 31, 35, .1) 0 1px 0;
`;

const buttonStyles: string = css`
	appearance: none;
	background-color: #2ea44f;
	border: 1px solid rgba(27, 31, 35, .15);
	border-right: none;
	box-sizing: border-box;
	color: #fff;
	cursor: pointer;
	display: inline-block;
	font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
	font-size: 14px;
	font-weight: 400;
	line-height: 20px;
	padding: 6px 16px;
	text-align: center;
	text-decoration: none;
	user-select: none;
	-webkit-user-select: none;
	touch-action: manipulation;
	vertical-align: middle;
	white-space: nowrap;
	border-radius: 6px 0 0 6px;

	&:focus:not(:focus-visible) {
		box-shadow: none;
		outline: none;
	}

	&:hover {
		background-color: #2c974b;
	}

	&:focus {
		box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px;
		outline: none;
	}

	&:disabled {
		background-color: #94d3a2;
		border-color: rgba(27, 31, 35, .1);
		color: rgba(255, 255, 255, .8);
		cursor: default;
	}

	&:active {
		background-color: #298e46;
		box-shadow: rgba(20, 70, 32, .2) 0 1px 0 inset;
	}
`;

const versionButtonStyles: string = css`
	appearance: none;
	background-color: #2ea44f;
	border: 1px solid rgba(27, 31, 35, .15);
	border-left: 1px solid rgba(255, 255, 255, .2);
	box-sizing: border-box;
	color: #fff;
	cursor: pointer;
	display: inline-block;
	font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
	font-size: 12px;
	font-weight: 400;
	line-height: 20px;
	padding: 6px 8px;
	text-align: center;
	text-decoration: none;
	user-select: none;
	-webkit-user-select: none;
	touch-action: manipulation;
	vertical-align: middle;
	white-space: nowrap;
	border-radius: 0 6px 6px 0;
	position: relative;

	&::after {
		content: "▼";
		font-size: 8px;
		margin-left: 4px;
	}

	&:focus:not(:focus-visible) {
		box-shadow: none;
		outline: none;
	}

	&:hover {
		background-color: #2c974b;
	}

	&:focus {
		box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px;
		outline: none;
	}

	&:disabled {
		background-color: #94d3a2;
		border-color: rgba(27, 31, 35, .1);
		color: rgba(255, 255, 255, .8);
		cursor: default;
	}

	&:active {
		background-color: #298e46;
		box-shadow: rgba(20, 70, 32, .2) 0 1px 0 inset;
	}
`;

const dropdownStyles = css`
	position: absolute;
	top: 100%;
	right: 0;
	background: white;
	border: 1px solid #d0d7de;
	border-radius: 6px;
	box-shadow: 0 8px 24px rgba(140, 149, 159, 0.2);
	z-index: 9999;
	margin-top: 4px;
	overflow: hidden;
	min-width: 120px;
	display: none;

	&.open {
		display: block;
	}
`;

const optionStyles = css`
	display: block;
	padding: 8px 12px;
	border: none;
	background: none;
	width: 100%;
	text-align: left;
	cursor: pointer;
	font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif;
	font-size: 14px;
	color: #24292f;
	transition: all 0.1s ease-in-out;

	&:hover {
		background-color: #2ea44f;
		color: white;
	}

	&:active {
		background-color: #298e46;
	}

	&.selected {
		background-color: #f0fdf4;
		color: #166534;
		font-weight: 600;
		position: relative;

		&::after {
			content: "✓";
			position: absolute;
			right: 8px;
			top: 50%;
			transform: translateY(-50%);
			color: #166534;
			font-weight: bold;
		}

		&:hover {
			background-color: #2ea44f;
			color: white;

			&::after {
				color: white;
			}
		}
	}
`;

export type ButtonOptions = {
	text?: string;
	link?: string;
	code?: string;
};

export async function createButton({
	text = defaultText,
	link = defaultLink,
	code,
}: ButtonOptions): Promise<HTMLDivElement> {
	const container = document.createElement('div');
	container.className = containerStyles;

	// Get selected version from storage
	const selectedVersion = await getSelectedVersion();
	let currentVersion = selectedVersion ?? '8.4';

	// Create main run button
	const button = document.createElement('button');
	button.textContent = text;
	button.className = buttonStyles;

	// Create version dropdown button
	const versionButton = document.createElement('button');
	versionButton.textContent = currentVersion;
	versionButton.className = versionButtonStyles;

	// Create dropdown menu
	const dropdown = document.createElement('div');
	dropdown.className = dropdownStyles;

	// Create option buttons
	const createOptionClickHandler = (versionValue: string, option: HTMLButtonElement) => async (event: Event) => {
		event.preventDefault();
		event.stopPropagation();

		// Update selected version in storage
		await setSelectedVersion(versionValue);

		// Update current version
		currentVersion = versionValue;

		// Update version button text
		versionButton.textContent = versionValue;

		// Update selected state
		for (const opt of dropdown.querySelectorAll('button')) {
			opt.classList.remove('selected');
		}

		option.classList.add('selected');

		// Update main button URL
		if (code) {
			const newUrl = createPlaygroundUrl(code, versionValue);
			button.addEventListener('click', () => window.open(newUrl));
		}

		// Close dropdown
		dropdown.classList.remove('open');

		// Dispatch custom event to sync other buttons
		document.dispatchEvent(new CustomEvent('php-version-changed', {
			detail: {version: versionValue},
		}));
	};

	for (const version of phpVersions) {
		const option = document.createElement('button');
		option.className = optionStyles;
		option.textContent = version.name;

		if (version.value === currentVersion) {
			option.classList.add('selected');
		}

		option.addEventListener('click', createOptionClickHandler(version.value, option));
		dropdown.append(option);
	}

	// Set up version button click handler
	versionButton.addEventListener('click', event => {
		event.preventDefault();
		event.stopPropagation();
		dropdown.classList.toggle('open');
	});

	// Set up main button click handler
	if (code) {
		const url = createPlaygroundUrl(code, currentVersion);
		button.addEventListener('click', () => window.open(url));
	} else {
		button.addEventListener('click', () => window.open(link));
	}

	// Close dropdown when clicking outside
	document.addEventListener('click', event => {
		if (!container.contains(event.target as Node)) {
			dropdown.classList.remove('open');
		}
	});

	// Listen for version changes from other buttons
	document.addEventListener('php-version-changed', (event: Event) => {
		const customEvent = event as CustomEvent<{version: string}>;
		const newVersion = customEvent.detail.version;
		if (newVersion !== currentVersion) {
			// Update current version
			currentVersion = newVersion;

			// Update version button text
			versionButton.textContent = newVersion;

			// Update selected state in dropdown
			const versionInfo = findPhpVersion(newVersion);
			for (const opt of dropdown.querySelectorAll('button')) {
				opt.classList.remove('selected');
				if (versionInfo && opt.textContent === versionInfo.name) {
					opt.classList.add('selected');
				}
			}

			// Update main button URL
			if (code) {
				const newUrl = createPlaygroundUrl(code, newVersion);
				button.addEventListener('click', () => window.open(newUrl));
			}
		}
	});

	container.append(button, versionButton, dropdown);
	return container;
}

function createPlaygroundUrl(code: string, version?: string): string {
	const url = new URL(baseUrl);
	url.searchParams.append('c', code);
	if (version) {
		// Always add version parameter when version is specified
		url.searchParams.append('v', version);
	}

	return url.toString();
}

