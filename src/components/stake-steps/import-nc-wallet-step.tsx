import { QuestionOutlineIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Text,
    Tooltip,
} from '@chakra-ui/react'
import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'

import NDDropzone from '@/components//nd-dropzone/nd-dropzone'
import NdInput from '@/components//nd-input/nd-input'
import { ForwardStepProps } from '@/components/stake-steps/step-props'
import { KeyManager } from '@/internal/pocket-js-2.1.1/packages/signer'

export type ImportNcWalletStepProps = {} & ForwardStepProps

const INVALID_PASSPHRASE_KEYFILE_ERR =
    'Unsupported state or unable to authenticate data'
const MALFORMED_KEYFILE_ERR = 'Malformed PPK'

function ImportNcWalletStep({ onNextStep }: ImportNcWalletStepProps) {
    const [nextStepEnabled, setNextStepEnabled] = useState(false)
    const [passphrase, setPassphrase] = useState('')
    const [keyString, setKeyString] = useState('')
    const [filePrompt, setUploadFilePrompt] = useState(
        'Click here or drag and drop your keyfile json.'
    )
    const [passphraseError, setPassphraseError] = useState<string | null>(null)

    const handlePassphraseInput = (event: ChangeEvent<HTMLInputElement>) => {
        setPassphrase(event.target.value)
    }

    useEffect(() => {
        setNextStepEnabled(passphrase.length > 0 && keyString.length > 0)
    }, [passphrase, keyString])

    const finishStep = async () => {
        try {
            const importedWallet = await KeyManager.fromPPK({
                password: passphrase,
                ppk: keyString,
            })
            onNextStep({
                wallet: importedWallet,
            })
        } catch (e: any) {
            if (
                !e.message.includes(
                    'Unsupported state or unable to authenticate data'
                ) &&
                !filePrompt.includes(MALFORMED_KEYFILE_ERR)
            ) {
                setUploadFilePrompt(`${filePrompt}, ${MALFORMED_KEYFILE_ERR}`)
                return
            }
            setPassphraseError(INVALID_PASSPHRASE_KEYFILE_ERR)
        }
    }

    const handleEnterPassphrase = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key == 'Enter' && nextStepEnabled) {
            finishStep()
        }
    }

    const onKeyFileAdded = (e: File[]) => {
        const keyFile = e[0]
        const reader = new FileReader()

        reader.onload = () => {
            console.log('File successfully read')
            setUploadFilePrompt(`Selected file: ${keyFile.name}`)
            setKeyString(reader.result as string)
        }

        reader.onabort = () => {
            console.log('File reading was aborted')
            setUploadFilePrompt(`${filePrompt}, ${MALFORMED_KEYFILE_ERR}`)
        }

        reader.onerror = () => {
            console.log('File reading has failed')
            setUploadFilePrompt(`${filePrompt}, ${MALFORMED_KEYFILE_ERR}`)
        }
        reader.readAsText(keyFile)
    }

    return (
        <Box>
            <Text color="White" fontSize="20px" fontWeight="400">
                Import your non custodial wallet keyfile, and enter the
                decryption passphrase.
            </Text>

            <Box margin="2rem 0">
                <HStack>
                    <Text color="white" margin="1rem 0">
                        Passphrase
                    </Text>
                    <Tooltip
                        label="This is the passphrase to decrypt your file when you created it on wallet.pokt.network"
                        fontSize="md"
                        closeOnClick={false}
                    >
                        <span>
                            <Icon as={QuestionOutlineIcon} color="white" />
                        </span>
                    </Tooltip>
                </HStack>

                <NdInput
                    onChange={handlePassphraseInput}
                    onKeyDown={handleEnterPassphrase}
                    type="password"
                    value={passphrase}
                    errorMessage={passphraseError}
                />
                <NDDropzone
                    onDrop={onKeyFileAdded}
                    acceptedFileType="json"
                    prompt={filePrompt}
                    isError={
                        filePrompt.includes('malformed') ||
                        filePrompt.includes('try again')
                    }
                />
            </Box>
            <Flex width="100%" justify="flex-end">
                <Button
                    backgroundColor="#5C58FF"
                    onClick={finishStep}
                    isDisabled={!nextStepEnabled}
                    size="lg"
                    _hover={{ backgroundColor: '#5C58FF' }}
                >
                    {'Next'}
                </Button>
            </Flex>
        </Box>
    )
}

export default ImportNcWalletStep
