import { Box, Input, Text } from "@chakra-ui/react";
import NodiesDropzone from "../nodies-dropzone/nodies-dropzone";

function Step1() {
  return (
    <Box>
      <Text color="White" fontSize="20px" fontWeight="400">
        Upload your master wallet and enter passphrase.
      </Text>

      <Box margin="2rem 0">
        <Text color="white" margin="1rem 0">
          Passphrase
        </Text>
        <Input type="text" />

        <NodiesDropzone onDrop={() => console.log} acceptFiles="ppk" />
      </Box>
    </Box>
  );
}

export default Step1;
