import {Box, Button, Flex, Text} from "@chakra-ui/react";
import NDDropzone from "../nd-dropzone/nd-dropzone";
import {useState} from "react";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {BidirectionalStepProps} from "@/components/stake-steps/step-props";

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
            setUploadFilePrompt(`Selected file: ${keyFile.name}`)
            setNextStepEnabled(true);
        }
        reader.readAsText(keyFile);
    }

    return (
        <Box>
            <Text color="White" fontSize="20px" fontWeight="400">
                {`Upload file of your "public keys" (provided by node provider)`}
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
