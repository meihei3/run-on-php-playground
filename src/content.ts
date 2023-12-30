// PHPコードの正規表現
const phpCodeRegex: RegExp = /<\?php[\s\S]+?\?>/g;

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
        console.log(code)
    });
});
