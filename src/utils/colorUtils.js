export function toHexStringOnly2LastDigits(n) {
    return ("0" + n.toString(16)).slice(-2);
}

export function hexColorToCssColor(hex)
{
    const r = (hex & 0xFF0000) >> 16;
    const g = (hex & 0xFF00) >> 8;
    const b = (hex & 0xFF);
    return "#" + toHexStringOnly2LastDigits(r) + toHexStringOnly2LastDigits(g) + toHexStringOnly2LastDigits(b);
}

function modifyColorComponent(hex, shift) {
    const filter = 0xff << shift;
    const filteredHex = (hex & filter) >> shift;
    const modified = (filteredHex>=0xd0)?  filteredHex-0x20 : filteredHex+0x20;
    return modified<<shift;

}
export function highlightColor(hex) {
    const r = modifyColorComponent(hex, 16);
    const g = modifyColorComponent(hex, 8);
    const b = modifyColorComponent(hex, 0);

    return r+g+b;
}
