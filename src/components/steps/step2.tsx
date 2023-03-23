import { Box, Text } from "@chakra-ui/react";
import NodiesDropzone from "../nodies-dropzone/nodies-dropzone";

function Step1() {
  return (
    <Box>
      <Text color="White" fontSize="20px" fontWeight="400">
        {`Upload file of your "public keys" (provided by node provider)`}
      </Text>

      <Box margin="2rem 0">
        <NodiesDropzone
          onDrop={() => {
            console.log();
          }}
        />
      </Box>
    </Box>
  );
}

export default Step1;
