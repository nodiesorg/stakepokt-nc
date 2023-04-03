import bigDecimal from 'js-big-decimal'

export const POKT_DENOM_UNIT = new bigDecimal('1000000')
const POKT_PRECISION = 6
export function toPokt(uPokt: bigDecimal): bigDecimal {
    return uPokt.divide(POKT_DENOM_UNIT, POKT_PRECISION)
}

export function toUPokt(pokt: bigDecimal): bigDecimal {
    return pokt.multiply(POKT_DENOM_UNIT)
}
