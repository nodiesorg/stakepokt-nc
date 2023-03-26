import type { AppProps } from "next/app";
import { StepsTheme } from "chakra-ui-steps";
import {
  ChakraProvider,
  extendTheme,
  StyleFunctionProps,
} from "@chakra-ui/react";

import { Input } from "@/styles/Input";
import { Button } from "@/styles/Button";

import { Inter, Poppins, Roboto } from "@next/font/google";
import {NumberInput} from "@/styles/NumberInput";


// Fonts
const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

// Custom chakra-ui-stake-steps style
const CustomStepsStyles = {
  ...StepsTheme,
  baseStyle: (props: StyleFunctionProps) => {
    return {
      ...StepsTheme.baseStyle(props),
    };
  },
};

// Extend theme
const theme = extendTheme({
  fonts: {
    Poppins: poppins.style.fontFamily,
    Roboto: roboto.style.fontFamily,
    Inter: inter.style.fontFamily,
  },
  styles: {
    global: {
      body: {
        backgroundColor: "#202436",
        minHeight: "100vh",
      },
    },
  },
  components: {
    Button,
    Input,
    NumberInput,
    Steps: CustomStepsStyles,
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
