import { Box, Text } from "@chakra-ui/react";
import NDDropzone from "../nd-dropzone/nd-dropzone";
import { useState } from "react";

function ImportNodeKeysStep({
  setCsv,
}: {
  setCsv: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [filePrompt, setUploadFilePrompt] = useState(
    "Click here or drag and drop your node csv."
  );
  const onKeyFileAdded = (e: File[]) => {
    const keyFile = e[0];
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      setUploadFilePrompt(`Selected file: ${keyFile.name}`);
    };
    reader.readAsText(keyFile);
  };
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
    </Box>
  );
}

export default ImportNodeKeysStep;
