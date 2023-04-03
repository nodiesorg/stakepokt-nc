import {
    Input,
    Text,
    InputGroup,
    InputRightElement,
    Icon,
    InputProps,
} from '@chakra-ui/react'
import { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

interface NdInputProps extends InputProps {
    errorMessage?: string | null
}

function NdInput({ errorMessage = null, type, ...restProps }: NdInputProps) {
    const [isShowPassword, setIsShowPassword] = useState(true)
    const [inputType, setInputType] = useState('')
    const isError = !!errorMessage

    const handleToggle = () => {
        const input = isShowPassword ? 'text' : 'password'

        setIsShowPassword(!isShowPassword)
        setInputType(input)
    }

    return (
        <>
            <InputGroup>
                <Input
                    errorBorderColor="#FC8181"
                    fontSize="0.875rem"
                    isInvalid={isError}
                    type={inputType ? inputType : type}
                    {...restProps}
                />

                {/* reveal password */}
                {type === 'password' ? (
                    <InputRightElement top="7px" onClick={handleToggle}>
                        {isShowPassword ? (
                            <Icon
                                as={AiOutlineEyeInvisible}
                                fontSize={20}
                                color="white"
                            />
                        ) : (
                            <Icon
                                as={AiOutlineEye}
                                fontSize={20}
                                color="white"
                            />
                        )}
                    </InputRightElement>
                ) : null}
            </InputGroup>

            {/* if error show error message and turn input border to red */}
            {isError ? (
                <Text color="#FC8181" margin=".5rem 0">
                    {errorMessage}
                </Text>
            ) : null}
        </>
    )
}

export default NdInput
