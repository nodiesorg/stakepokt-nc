import { ComponentMultiStyleConfig } from '@chakra-ui/react'

export const TableContainerStyle = {
    margin: '2rem 0',
    height: '300px',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
        width: '7px',
        borderRadius: '5px',
        backgroundColor: '#202436',
    },
    '&::-webkit-scrollbar-thumb': {
        borderRadius: '5px',
        backgroundColor: '#B9B6D7',
    },
    '&::-webkit-scrollbar:horizontal': {
        display: 'none',
    },
}

export const Table: ComponentMultiStyleConfig = {
    parts: ['table', 'tbody', 'th', 'tr'],
    baseStyle: {
        table: {
            margin: '2rem 0',
            height: '300px',
            overflowY: 'auto',
            tableLayout: 'fixed',
            whiteSpace: 'normal',
            td: {
                wordWrap: 'break-word',
                wordBreak: 'break-all',
            },
        },
    },
}
