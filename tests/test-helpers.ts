import { Page } from '@playwright/test'
import fs from 'fs'

export const dragAndDropFile = async (
    page: Page,
    filePath: string,
    fileName: string,
    fileType: string,
    selector: string
) => {
    const fileBuffer = await fs.promises.readFile(filePath)
    const dataTransfer = await page.evaluateHandle(
        ({ data, fileName, fileType }) => {
            const uint8Array = new Uint8Array(data)
            const dt = new DataTransfer()
            const file = new File([uint8Array], fileName, { type: fileType })
            dt.items.add(file)
            return dt
        },
        { data: Array.from(fileBuffer), fileName, fileType }
    )
    await page.dispatchEvent(selector, 'drop', {
        dataTransfer,
    })
}

export const clickNextButton = async (page: Page) => {
    let nextBtn = page.getByRole('button', { name: 'Next' })
    await nextBtn.scrollIntoViewIfNeeded()
    await nextBtn.click()
}

export const mockBalanceCheck = async (page: Page, balance: number) => {
    await page.route(
        'https://node1.testnet.pokt.network/v1/query/balance',
        async (route) => {
            const json = { balance }
            await route.fulfill({ json })
        }
    )
}

export const mockTransaction = async (
    page: Page,
    generatedTxHashes: string[]
) => {
    await page.route(
        'https://node1.testnet.pokt.network/v1/client/rawtx',
        async (route) => {
            const json = {
                logs: null,
                txhash: Math.random().toString(16).substring(2, 64),
            }
            generatedTxHashes.push(json.txhash)
            await route.fulfill({ json })
        }
    )
}
