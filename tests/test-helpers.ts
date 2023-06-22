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

export const clickButton = async (page: Page, name: string) => {
    let nextBtn = page.getByRole('button', { name })
    await nextBtn.scrollIntoViewIfNeeded()
    await nextBtn.click()
}

export const clickNextButton = async (page: Page) => clickButton(page, 'Next')

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
    status: number,
    generatedTxHashes?: string[]
) => {
    await page.route(
        'https://node1.testnet.pokt.network/v1/client/rawtx',
        async (route) => {
            if (status > 200) {
                await route.fulfill({
                    status,
                })
                return
            }
            const json = {
                logs: null,
                txhash: Math.random().toString(16).substring(2, 64),
            }
            if (generatedTxHashes) generatedTxHashes.push(json.txhash)
            await route.fulfill({ status, json })
        }
    )
}

export const fillAdditionalTransferAmount = async (
    page: Page,
    amount: string
) => {
    // find by testid id additional-transfer-amount
    await page.getByTestId('additional-transfer-amount').fill(amount)
}

export const importNonCustodialWallet = async (page: Page) => {
    await page.goto('/') // Navigate to the import page

    await page.getByRole('textbox').fill('P@assword1')

    // Simulate importing a valid PPK file
    await dragAndDropFile(
        page,
        './tests/fixtures/keyfile.json',
        'valid_keyfile.json',
        'application/json',
        '[data-testid="dropzone"]' // Placeholder selector for the dropzone
    )

    await clickNextButton(page)
}

export const importNodeKeys = async (page: Page) => {
    // Simulate importing a CSV file with a valid PPK
    await dragAndDropFile(
        page,
        './tests/fixtures/nodes.csv', // path to your valid csv file
        'valid_nodes.csv',
        'text/csv',
        '[data-testid="dropzone"]' // Placeholder selector for the CSV dropzone
    )

    await clickNextButton(page)
}

export const verifyConfirmationStep = async (page: Page) => {
    await page.getByText('Stake Amount Per Node: 60005').isVisible()
    await page.getByText('Nodes to Stake: 3').isVisible()
    await page.getByText('Additional Transfer Amount: 5').isVisible()
    await page
        .getByText(
            'Non Custodial Address: fd9d64cb536ea7230710321a718823d322d906d0'
        )
        .isVisible()
    await page
        .getByRole('button', { name: "Yes, I'm ready to stake" })
        .isVisible()
}

export const withResponse = async (
    page: Page,
    urlOrPredicate: string,
    action: () => Promise<void>
) => {
    const response = page.waitForResponse(urlOrPredicate)
    await action()
    await response
}
