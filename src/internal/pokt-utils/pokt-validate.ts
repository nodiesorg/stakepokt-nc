const HEX_REGEX = new RegExp('^[0-9a-fA-F]+$')

export function isHex(input: string): boolean {
    return HEX_REGEX.test(input)
}
