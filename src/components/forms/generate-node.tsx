import { useState } from "react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Button,
  CardBody,
  CardHeader,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  Tooltip,
} from "@chakra-ui/react";

import NdInput from "../nd-input/nd-input";

function GenerateNodeForm() {
  const [isEnableChains, setIsEnableChains] = useState(false);

  return (
    <CardBody>
      <CardHeader>
        <Heading
          color="white"
          fontFamily="Poppins"
          fontSize="24px"
          fontWeight={500}
          textAlign="center"
        >
          Node Operator Key-Gen Tool
        </Heading>
      </CardHeader>

      {/* Enter number of nodes to generate */}
      <HStack>
        <Text color="white" margin="1rem 0">
          Enter number of nodes to generate
        </Text>
        <Tooltip
          label="add tooltip message here"
          fontSize="md"
          closeOnClick={false}
        >
          <span>
            <Icon as={QuestionOutlineIcon} color="white" />
          </span>
        </Tooltip>
      </HStack>
      <NdInput onChange={() => console.log("onChangeHandler")} type="text" />

      {/* Enter the chains */}
      <HStack>
        <Text color="white" margin="1rem 0">
          Enter the chains
        </Text>
        <Tooltip
          label="add tooltip message here"
          fontSize="md"
          closeOnClick={false}
        >
          <span>
            <Icon as={QuestionOutlineIcon} color="white" />
          </span>
        </Tooltip>
      </HStack>
      <NdInput
        onChange={() => console.log("onChangeHandler")}
        type="text"
        isDisabled={!isEnableChains}
      />
      <Checkbox
        color="white"
        margin="1rem 0"
        onChange={() => setIsEnableChains(!isEnableChains)}
      >
        Change chains
      </Checkbox>

      {/* Generate node button */}
      <Flex width="100%" justify="flex-end" marginY="2rem">
        <Button
          backgroundColor="#5C58FF"
          onClick={() => console.log("clickhandler")}
          size="lg"
          _hover={{ backgroundColor: "#5C58FF" }}
        >
          Generate Nodes
        </Button>
      </Flex>
    </CardBody>
  );
}

export default GenerateNodeForm;
