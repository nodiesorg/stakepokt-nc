import bigDecimal from 'js-big-decimal'

import { ChangeEvent, ReactNode, useEffect, useState } from 'react'
import { Simulate } from 'react-dom/test-utils'
import NdInput from './nd-input'
import invalid = Simulate.invalid

type NDPoktDenomInputProps = {
    testid?: string
    maxPoktValue?: bigDecimal
    minPoktValue?: bigDecimal
    defaultPoktValue: bigDecimal
    showZeroValue?: boolean
    invalid?: boolean
    onChange?: (value: bigDecimal) => void
} & { children?: ReactNode }

const POKT_REGEX = new RegExp(/^\d{0,9}(\.\d{0,6})?$/)

const NDPoktDenomInput = ({
    testid,
    children,
    onChange,
    defaultPoktValue,
    maxPoktValue,
    minPoktValue,
}: NDPoktDenomInputProps) => {
    const [poktValueString, setPoktValueString] = useState<string>(
        defaultPoktValue.getValue()
    )

    const [invalidReason, setInvalidReason] = useState('')

    useEffect(() => {
        // Callback change values
        const inputDecimal = new bigDecimal(
            poktValueString.length > 0 ? poktValueString : '0'
        )
        if (onChange != undefined) onChange(inputDecimal)
        if (minPoktValue && inputDecimal.compareTo(minPoktValue) < 0) {
            setInvalidReason(
                `${inputDecimal.getValue()} is less the required minimum ${minPoktValue.getValue()}`
            )
            return
        }
        if (maxPoktValue && inputDecimal.compareTo(maxPoktValue) > 0) {
            setInvalidReason(
                `${inputDecimal.getValue()} is more than the maximum ${maxPoktValue.getValue()}`
            )
            return
        }
        setInvalidReason('')
    }, [poktValueString])

    const handlePoktValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value
        // Reset values if user erases all inputs
        if (input.length == 0) {
            setPoktValueString(input)
            return
        }
        // Check if it fits decimal format
        if (!POKT_REGEX.test(input)) return
        setPoktValueString(input)
    }

    return (
        <NdInput
            data-testid={testid}
            onChange={handlePoktValueChange}
            value={poktValueString}
            errorMessage={invalidReason}
        />
    )
}

export default NDPoktDenomInput
