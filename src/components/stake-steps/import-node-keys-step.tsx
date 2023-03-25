import {Box, Button, Flex, Text} from "@chakra-ui/react";
import NDDropzone from "../nd-dropzone/nd-dropzone";
import {useState} from "react";
import {ArrowBackIcon} from "@chakra-ui/icons";
import * as CSV from 'csv-string';
import {BidirectionalStepProps} from "@/components/stake-steps/step-props";
import {KeyManager} from "@pokt-foundation/pocketjs-signer";
import {ImportedNcNode} from "@/internal/pokt-types/imported-nc-node";
import {add} from "@noble/hashes/_u64";

export type ImportNodeKeysStepProps = {} & BidirectionalStepProps;

function ImportNodeKeysStep({onPrevStep, onNextStep}: ImportNodeKeysStepProps) {

    const [filePrompt, setUploadFilePrompt] = useState('Click here or drag and drop your node csv.')
    const [nextStepEnabled, setNextStepEnabled] = useState(false)
    const onKeyFileAdded = (e: File[]) => {
        const keyFile = e[0];
        const reader = new FileReader()
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
            const result = reader.result as string
            const csvResult = CSV.parse(result);

            const importedAccounts: ImportedNcNode[] = []

            for (const [i, c] of csvResult.entries()) {
                if (i == 0)
                    continue
                if (c.length < 3)
                    continue;
                const nodeAlias = c[0].trim();
                const publicKey = c[1].trim();
                const address = c[2].trim();
                if (nodeAlias.length == 0 || publicKey.length != 64 || address.length != 20) // TODO add validation error
                    continue;
                importedAccounts.push({
                    nodeAlias,
                    publicKey,
                    address,
                })
            }
            setUploadFilePrompt(`Selected file: ${keyFile.name}, nodes detected: ${importedAccounts.length}`)
            if (importedAccounts.length > 0)
                setNextStepEnabled(true);
        }
        // Read File
        reader.readAsText(keyFile);
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
                    onDrop={onKeyFileAdded}
                    acceptedFileType="csv"
                />
            </Box>
            <Flex width="100%" justify="flex-end">
                <Button
                    border="1px solid white"
                    color="white"
                    leftIcon={<ArrowBackIcon/>}
                    marginRight={4}
                    onClick={onPrevStep}
                    size="lg"
                    variant="outline"
                    _hover={{backgroundColor: "transparent"}}
                >
                    Back
                </Button>
                <Button
                    backgroundColor="#5C58FF"
                    onClick={onNextStep}
                    isDisabled={!nextStepEnabled}
                    size="lg"
                    _hover={{backgroundColor: "#5C58FF"}}
                >
                    {"Next"}
                </Button>
            </Flex>
        </Box>
    );
}

export default ImportNodeKeysStep;
