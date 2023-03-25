import {Accept, useDropzone} from "react-dropzone";
import { Box, Text } from "@chakra-ui/react";

type DropdownFileTypes = "ppk" | "csv" | "txt" | "json";

type NodiesDropzoneProps = {
  onDrop: (acceptedFiles: any) => void;
  prompt: string;
  acceptedFileType: DropdownFileTypes
};

function transformDropzoneAcceptType(fileType: DropdownFileTypes): Accept {
  switch (fileType) {
    case "ppk":
    case "txt":
    case "csv":
      return {'text/csv': [`.${fileType}`]}
    default:
      return {'application/json': [`.${fileType}`]}
  }
}

const NDDropzone = ({ onDrop, acceptedFileType, prompt }: NodiesDropzoneProps) => {


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: transformDropzoneAcceptType(acceptedFileType),
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
          {`${prompt}`}
        </Text>
      </Box>
    </>
  );
};

export default NDDropzone;
