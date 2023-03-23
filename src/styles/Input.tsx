import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Input: ComponentStyleConfig = {
  baseStyle: {
    field: {
      width: "full",
      borderColor: "#363D63",
      color: "white",
      paddingY: "26px",
      _focus: {
        borderColor: "#5C58FF",
      },
    },
  },
};
