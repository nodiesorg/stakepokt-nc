import { useDropzone } from "react-dropzone";
import { Box, Text } from "@chakra-ui/react";

type NodiesDropzoneProps = {
  onDrop: (acceptedFiles: any) => void;
  acceptFiles: "ppk" | "csv" | "txt";
};

const NodiesDropzone = ({ onDrop, acceptFiles }: NodiesDropzoneProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept:
      acceptFiles === "ppk"
        ? { "application/x-putty-private-key": [".ppk"] }
        : { "text/plain": [".csv", ".txt"] },
  });

  return (
    <>
      <Box
        {...getRootProps()}
        backgroundColor="#363D63"
        border="1px dashed white"
        borderRadius="8px"
        color="White"
        cursor="pointer"
        display="flex"
        margin="20px 0"
        padding="45px 20px"
        justifyContent="center"
        width="full"
      >
        <input {...getInputProps()} />

        <Text fontSize="16px" color="Blue1" fontWeight="500">
          Add file or drop files here
        </Text>
      </Box>
    </>
  );
};

export default NodiesDropzone;
