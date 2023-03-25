import {Box, Input, Text} from "@chakra-ui/react";
import NDDropzone from "../nd-dropzone/nd-dropzone";
import {useState} from "react";


function ImportNcWalletStep() {

    const [filePrompt, setUploadFilePrompt] = useState('Click here or drag and drop your keyfile json.')
    const onKeyFileAdded = (e: File[]) => {
        const keyFile = e[0];
        const reader = new FileReader()
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
            const fileJson = JSON.parse(reader.result as string)
            setUploadFilePrompt(`Selected file: ${keyFile.name}`)
        }
        reader.readAsText(keyFile);
    }

    return (
        <Box>
            <Text color="White" fontSize="20px" fontWeight="400">
                Import your non custodial wallet keyfile, and enter the decryption passphrase.
            </Text>

            <Box margin="2rem 0">
                <Text color="white" margin="1rem 0">
                    Passphrase
                </Text>
                <Input type="text"/>
                <NDDropzone onDrop={onKeyFileAdded} acceptedFileType="json" prompt={filePrompt}/>
            </Box>
        </Box>
    );
}

export default ImportNcWalletStep;
