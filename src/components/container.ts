import {css} from '@linaria/core';

const styles: string = css`
    position: relative;
`;

export function createContainer(): HTMLDivElement {
	const container: HTMLDivElement = document.createElement('div');
	container.className = styles;
	return container;
}
