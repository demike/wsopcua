
// xx const deprecated_trim = function (str:string):string {
// xx     return str.replace(/^\s+|\s+$/g, "");
// xx };

export function inlineText(txtFile: string): string {
    let k = txtFile; /* .
        replace(/^[^\/]+\/\*!?/, '').
        replace(/\*\/[^\/]+$/, '');
        */
    console.log(txtFile);
    k = k.split('\n').map((t: string) => t.trim()).join('\n');
    return k;
}

function hexString(str: string): string {

    let hexline = '';
    const lines = str.split('\n');
    for (let line of lines) {
        line = line.trim();
        if (line.length > 80) {
            line = line.substr(10, 98).trim();
            hexline = hexline ? hexline + ' ' + line : line;
        } else if (line.length > 60) {
            line = line.substr(7, 48).trim();
            hexline = hexline ? hexline + ' ' + line : line;
        }
    }
    return hexline;
}

export function makebuffer_from_trace(strFilePath: string): Promise<Uint8Array> {
    return fetch(strFilePath)
    .then( (value) => value.text())
    .then( (strContent) => {
        return makeBuffer(hexString(inlineText(strContent)));
    });

}

export function makeBuffer(listOfBytes: string): Uint8Array {
    const l = listOfBytes.split(' ');
    const b = new Uint8Array(l.length);
    let i = 0;
    l.forEach(function (value) {
        b[i] = parseInt(value, 16);
        i += 1;
    });
    return b;
}
