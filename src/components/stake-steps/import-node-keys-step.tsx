import { BidirectionalStepProps } from '@/components/stake-steps/step-props'
import { ImportedNcNode } from '@/internal/pokt-types/imported-nc-node'
import { isHex } from '@/internal/pokt-utils/pokt-validate'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import * as CSV from 'csv-string'
import { useState } from 'react'
import NDDropzone from '../nd-dropzone/nd-dropzone'

export type ImportNodeKeysStepProps = {} & BidirectionalStepProps

function ImportNodeKeysStep({
    onPrevStep,
    onNextStep,
}: ImportNodeKeysStepProps) {
    const [filePrompt, setUploadFilePrompt] = useState(
        'Click here or drag and drop your node csv.'
    )
    const [nextStepEnabled, setNextStepEnabled] = useState(false)
    const [importedAccounts, setImportedAccounts] = useState<ImportedNcNode[]>(
        []
    )

    const finishStep = () => {
        onNextStep({ nodesToStake: importedAccounts })
    }
    const parseCsv = (keyFile: File, csvResult: string[][]) => {
        // @ts-ignore
        const parsedAccounts: (ImportedNcNode | undefined)[] = csvResult.map(
            (c, i) => {
                if (i == 0)
                    // skip first csv line
                    return undefined
                if (c.length < 3)
                    // csv format needs at least 3 headers (nodeAlias,pubKey,address)
                    return undefined
                const nodeAlias = c[0].trim()
                const publicKey = c[1].trim()
                const address = c[2].trim()
                if (
                    nodeAlias.length == 0 ||
                    publicKey.length != 64 ||
                    !isHex(publicKey) ||
                    address.length != 40 ||
                    !isHex(address)
                ) {
                    return undefined
                }

                let domain: string | undefined
                let chains: string[] | undefined

                if (c.length >= 4) {
                    domain = c[3].trim()
                }

                if (c.length >= 5) {
                    chains = c[4].split(',').map((s) => s.trim())
                    if (chains.length == 0) return undefined
                }

                return {
                    node_alias: nodeAlias,
                    pub_key: publicKey,
                    address,
                    domain,
                    chains,
                }
            }
        )

        if (parsedAccounts.find((s) => s == undefined)) {
            setUploadFilePrompt('Failed to parse CSV')
            return
        }

        const filteredAccounts = parsedAccounts.filter((s) => s !== undefined)

        if (filteredAccounts.length > 0) {
            // @ts-ignore
            setImportedAccounts(filteredAccounts)
            setNextStepEnabled(true)
        }
        setUploadFilePrompt(
            `Selected file: ${keyFile.name}, nodes detected: ${filteredAccounts.length}`
        )
    }

    const onImportedNodesAdded = (e: File[]) => {
        const keyFile = e[0]
        const reader = new FileReader()
        reader.onabort = () =>
            setUploadFilePrompt('csv read aborted, try again')
        reader.onerror = () => setUploadFilePrompt('csv read error, try again')
        reader.onload = () => {
            const result = reader.result as string
            const csvResult = CSV.parse(result)
            parseCsv(keyFile, csvResult)
        }
        // Read File
        reader.readAsText(keyFile)
    }

    return (
        <Box>
            <Text color="White" fontSize="20px" fontWeight="400">
                {`Upload the node file to stake. This is generally provided by Node Operator`}
            </Text>
            <Text color="White" fontSize="20px" fontWeight="400">
                {`format: nodeAlias,pubkey,address.csv`}
            </Text>

            <Box margin="2rem 0">
                <NDDropzone
                    prompt={filePrompt}
                    onDrop={onImportedNodesAdded}
                    acceptedFileType="csv"
                    isError={
                        filePrompt.includes('Failed') ||
                        filePrompt.includes('try again')
                    }
                />
            </Box>
            <Flex width="100%" justify="flex-end">
                <Button
                    border="1px solid white"
                    color="white"
                    leftIcon={<ArrowBackIcon />}
                    marginRight={4}
                    onClick={onPrevStep}
                    size="lg"
                    variant="outline"
                    _hover={{ backgroundColor: 'transparent' }}
                >
                    Back
                </Button>
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

export default ImportNodeKeysStep
