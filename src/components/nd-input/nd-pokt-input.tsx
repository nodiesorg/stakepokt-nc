import bigDecimal from 'js-big-decimal';

import {Input} from "@chakra-ui/react";
import {ChangeEvent, ReactNode, useState} from "react";
import {Simulate} from "react-dom/test-utils";
import invalid = Simulate.invalid;
import {toUPokt} from "@/internal/pokt-utils/pokt-denom";

type NDPoktDenomInputProps = {
    maxPoktValue?: bigDecimal,
    minPoktValue?: bigDecimal,
    defaultPoktValue: bigDecimal
    invalid?: boolean;
    onChange?: (value: bigDecimal) => void;
} & { children?: ReactNode };


const POKT_REGEX = new RegExp(/^\d{0,9}(\.\d{0,6})?$/);


const NDPoktDenomInput =
    ({
         children,
         onChange,
         defaultPoktValue,
         maxPoktValue,
         minPoktValue
     }: NDPoktDenomInputProps) => {
        const [poktValue, setPoktValue] = useState<bigDecimal>(defaultPoktValue);
        const [invalidReason, setInvalidReason] = useState('')
        const handlePoktValueChange = (event: ChangeEvent<HTMLInputElement>) => {
            const input = event.target.value;
            if (!POKT_REGEX.test(input))
                return;
            const inputDecimal = new bigDecimal(input)
            if (minPoktValue && inputDecimal.compareTo(minPoktValue) < 0) {
                setInvalidReason(`${inputDecimal.getValue()} is less the required minimum ${minPoktValue.getValue()}`)
                return
            }
            if (maxPoktValue && inputDecimal.compareTo(maxPoktValue) > 0) {
                setInvalidReason(`${inputDecimal.getValue()} is more than the maximum ${maxPoktValue.getValue()}`)
                return
            }
            setInvalidReason("")
            setPoktValue(inputDecimal)
            if (onChange != undefined)
                onChange(inputDecimal)
        }

        return (
            <Input
                isInvalid={invalidReason.length > 0}
                value={poktValue.getValue()}
                onChange={handlePoktValueChange}
            >
                {children}
            </Input>

        );
    };

export default NDPoktDenomInput;
