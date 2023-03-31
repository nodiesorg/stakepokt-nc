import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Tooltip,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";

import NdInput from "@/components//nd-input/nd-input";
import NDDropzone from "@/components//nd-dropzone/nd-dropzone";
import { ForwardStepProps } from "@/components/stake-steps/step-props";
import { KeyManager } from "@/internal/pocket-js-2.1.1/packages/signer";

export type ImportNcWalletStepProps = {} & ForwardStepProps;

function ImportNcWalletStep({ onNextStep }: ImportNcWalletStepProps) {
  const [nextStepEnabled, setNextStepEnabled] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [keyString, setKeyString] = useState("");
  const [filePrompt, setUploadFilePrompt] = useState(
    "Click here or drag and drop your keyfile json."
  );
  const [passphraseError, setPassphraseError] = useState<string | null>(null);

  const handlePassphraseInput = (event: ChangeEvent<HTMLInputElement>) => {
    setPassphrase(event.target.value);
  };

  useEffect(() => {
    if (passphrase.length > 0) {
      setPassphraseError("");
      if (keyString.length > 0) setNextStepEnabled(true);
    } else {
      if (passphraseError === null) return;
      setPassphraseError("passphrase invalid");
    }
  }, [passphrase, keyString, passphraseError]);

  const finishStep = async () => {
    try {
      const importedWallet = await KeyManager.fromPPK({
        password: passphrase,
        ppk: keyString,
      });
      onNextStep({
        wallet: importedWallet,
      });
    } catch (e) {
      setUploadFilePrompt(`${filePrompt}, PPK malformed.`);
    }
  };

  const handleEnterPassphrase = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter" && nextStepEnabled) {
      finishStep();
    }
  };

  const onKeyFileAdded = (e: File[]) => {
    const keyFile = e[0];
    const reader = new FileReader();
    reader.onabort = () => setUploadFilePrompt("json read aborted, try again");
    reader.onerror = () => setUploadFilePrompt("json read error, try again");
    reader.onload = async () => {
      setUploadFilePrompt(`Selected file: ${keyFile.name}`);
      setKeyString(reader.result as string);
    };
    reader.readAsText(keyFile);
  };

  return (
    <Box>
      <Text color="White" fontSize="20px" fontWeight="400">
        Import your non custodial wallet keyfile, and enter the decryption
        passphrase.
      </Text>

      <Box margin="2rem 0">
        <HStack>
          <Text color="white" margin="1rem 0">
            Passphrase
          </Text>
          <Tooltip
            label="This is the passphrase to decrypt your file when you created it on wallet.pokt.network"
            fontSize="md"
            closeOnClick={false}
          >
            <span>
              <Icon as={QuestionOutlineIcon} color="white" />
            </span>
          </Tooltip>
        </HStack>

        <NdInput
          onChange={handlePassphraseInput}
          onKeyDown={handleEnterPassphrase}
          type="password"
          value={passphrase}
          errorMessage={passphraseError}
        />
        <NDDropzone
          onDrop={onKeyFileAdded}
          acceptedFileType="json"
          prompt={filePrompt}
          isError={
            filePrompt.includes("malformed") || filePrompt.includes("try again")
          }
        />
      </Box>
      <Flex width="100%" justify="flex-end">
        <Button
          backgroundColor="#5C58FF"
          onClick={finishStep}
          isDisabled={!nextStepEnabled}
          size="lg"
          _hover={{ backgroundColor: "#5C58FF" }}
        >
          {"Next"}
        </Button>
      </Flex>
    </Box>
  );
}

export default ImportNcWalletStep;
