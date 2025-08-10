import * as lzstring from 'lz-string';
import {createButton} from './components/button.ts';
import {createContainer} from './components/container.ts';

// Regular expression for PHP code
const phpCodeRegex = /<\?php[\s\S]+?\?>/g;
// Base URL
const baseUrl = 'https://php-play.dev/';

// Extract PHP codes from HTML element
function getPhpCodes(element: HTMLElement): string[] {
	// Clone the element
	const cloneElement: Node = element.cloneNode(true);
	if (!(cloneElement instanceof HTMLElement)) {
		return [];
	}

	// Convert <br> tags to newlines
	cloneElement.innerHTML = cloneElement.innerHTML.replaceAll('<br>', '\n');
	// Get text content
	const text = cloneElement.textContent;

	// Extract PHP code
	const phpCode = text?.match(phpCodeRegex);
	if (!phpCode) {
		return [];
	}

	// Remove trailing `?>`
	return phpCode.map(code => code.replace(/\?>$/, ''));
}

// Process PHP code elements on the page
function processPhpElements(): void {
	const elements: NodeListOf<HTMLElement> = document.querySelectorAll('div.phpcode code');
	for (const element of elements) {
		for (const code of getPhpCodes(element)) {
			// Get compressed code
			const compressedCode = lzstring.compressToEncodedURIComponent(code);

			// Create container
			const container: HTMLDivElement = createContainer();
			// Move original element to container
			element.parentNode?.insertBefore(container, element);
			container.append(element);

			// Create button and add to container (async)
			// eslint-disable-next-line promise/prefer-await-to-then
			void createButton({code: compressedCode})
				// eslint-disable-next-line promise/prefer-await-to-then
				.then(buttonContainer => {
					element.append(buttonContainer);
				})
				// eslint-disable-next-line promise/prefer-await-to-then
				.catch((error: unknown) => {
					console.error('Failed to create button:', error);
					// Fallback: create simple button
					const url = new URL(baseUrl);
					url.searchParams.append('c', compressedCode);
					const fallbackButton = document.createElement('button');
					fallbackButton.textContent = 'Run on Playground';
					fallbackButton.addEventListener('click', () => {
						window.open(url.toString());
					});
					fallbackButton.style.cssText = 'position: absolute; right: 0; top: 0;';
					element.append(fallbackButton);
				});
		}
	}
}

// Initialize the processing
processPhpElements();

