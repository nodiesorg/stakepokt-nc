import {
    ChakraProvider,
    extendTheme,
    StyleFunctionProps,
} from '@chakra-ui/react'
import { StepsTheme } from 'chakra-ui-steps'
import type { AppProps } from 'next/app'

import { Button } from '@/styles/Button'
import { Input } from '@/styles/Input'

import { NumberInput } from '@/styles/NumberInput'
import { Inter, Poppins, Roboto } from '@next/font/google'

// Fonts
const roboto = Roboto({
    weight: ['400', '500', '700'],
    subsets: ['latin'],
})

const poppins = Poppins({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
})

const inter = Inter({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
})

// Custom chakra-ui-stake-steps style
const CustomStepsStyles = {
    ...StepsTheme,
    baseStyle: (props: StyleFunctionProps) => {
        return {
            ...StepsTheme.baseStyle(props),
        }
    },
}

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
                backgroundColor: '#202436',
                minHeight: '100vh',
            },
        },
    },
    components: {
        Button,
        Input,
        NumberInput,
        Steps: CustomStepsStyles,
    },
})

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    )
}
