import {createButton} from "./components/button.ts";
import {createContainer} from "./components/container.ts";

import * as lzstring from 'lz-string';

// PHPコードの正規表現
const phpCodeRegex: RegExp = /<\?php[\s\S]+?\?>/g;
// Base URL
const baseUrl = 'https://php-play.dev/';

// 要素からPHPコードを取得する
function getPhpCodes(element: HTMLElement): string[] {
    // 要素をクローン
    const cloneElement: Node = element.cloneNode(true);
    if (!(cloneElement instanceof HTMLElement)) {
        return [];
    }

    // brタグを改行に変換
    cloneElement.innerHTML = cloneElement.innerHTML.replace(/<br>/g, '\n');
    // テキストを取得
    const text = cloneElement.textContent;

    // PHPコードを取得
    const phpCode = text?.match(phpCodeRegex);
    if (!phpCode) {
        return [];
    }

    // `?>` は削除
    return phpCode.map((code) => code.replace(/\?>$/, ''));
}


// ページからPHPコードを取得
const elements: NodeListOf<HTMLElement> = document.querySelectorAll('div.phpcode code');
elements.forEach((element: HTMLElement) => {
    getPhpCodes(element).forEach((code) => {
        // URLを作成
        const url = new URL(baseUrl);
        url.searchParams.append('c', lzstring.compressToEncodedURIComponent(code));

        // コンテナを作成
        const container: HTMLDivElement = createContainer();
        // 元の要素をコンテナに移動
        element.parentNode?.insertBefore(container, element);
        container.appendChild(element);

        // ボタンを作成してコンテナに追加
        element.appendChild(createButton({link: url.toString()}));
    });
});
