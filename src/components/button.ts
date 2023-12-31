import {css} from '@emotion/css'

const defaultText = 'Run in Playground';
const defaultLink = 'https://php-play.dev/';

const styles: string = css`
    position: absolute;
    right: 0;
    top: 0;

    appearance: none;
    background-color: #2ea44f;
    border: 1px solid rgba(27, 31, 35, .15);
    border-radius: 6px;
    box-shadow: rgba(27, 31, 35, .1) 0 1px 0;
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

    :focus:not(:focus-visible) {
        box-shadow: none;
        outline: none;
    }

    :hover {
        background-color: #2c974b;
    }

    :focus {
        box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px;
        outline: none;
    }

    :disabled {
        background-color: #94d3a2;
        border-color: rgba(27, 31, 35, .1);
        color: rgba(255, 255, 255, .8);
        cursor: default;
    }

    :active {
        background-color: #298e46;
        box-shadow: rgba(20, 70, 32, .2) 0 1px 0 inset;
    }
`;

export function createButton({text = defaultText, link = defaultLink}: {
    text?: string, link?: string
}): HTMLButtonElement {
    const button: HTMLButtonElement = document.createElement('button');
    button.innerText = text;
    button.onclick = () => {
        window.open(link);
    };
    button.className = styles;
    return button;
}
