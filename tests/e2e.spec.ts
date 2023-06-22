import { expect, Page, test } from '@playwright/test'
import fs from 'fs'

const dragAndDropFile = async (
    page: Page,
    filePath: string,
    fileName: string,
    fileType: string,
    selector: string
) => {
    // Read your file into a buffer.
    const fileBuffer = await fs.promises.readFile(filePath)

    // Create the DataTransfer and File
    const dataTransfer = await page.evaluateHandle(
        ({ data, fileName, fileType }) => {
            const uint8Array = new Uint8Array(data)

            // Debug log statement to print the string contents of the file
            console.log('File contents:', String.fromCharCode(...uint8Array))

            const dt = new DataTransfer()
            const file = new File([uint8Array], fileName, { type: fileType })
            dt.items.add(file)
            return dt
        },
        { data: Array.from(fileBuffer), fileName, fileType }
    )

    // Now dispatch
    await page.dispatchEvent(selector, 'drop', {
        dataTransfer,
    })
}

test('test', async ({ page }) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    await page.goto('/')
    await page.getByRole('textbox').click()
    await page.getByRole('textbox').fill('P@assword1')

    // Drag and drop keyfile.json
    await dragAndDropFile(
        page,
        './tests/fixtures/keyfile.json',
        'keyfile.json',
        'application/json',
        '[data-testid="dropzone"]'
    )

    await page.getByRole('button', { name: 'Next' }).click()

    // Drag and drop nodes.csv
    await dragAndDropFile(
        page,
        './tests/fixtures/nodes.csv',
        'nodes.csv',
        'text/csv',
        '[data-testid="dropzone"]'
    )

    await page.route(
        'https://node1.testnet.pokt.network/v1/query/balance',
        async (route) => {
            const json = { balance: 1e15 }
            await route.fulfill({ json })
        }
    )

    let nextBtn = page.getByRole('button', { name: 'Next' })
    await nextBtn.scrollIntoViewIfNeeded()
    await nextBtn.click()

    expect(
        await page.getByText('Wallet Balance: 1000000000.000000').count()
    ).toBe(1)

    // find by testid id additional-transfer-amount
    await page.getByTestId('additional-transfer-amount').fill('5')

    nextBtn = page.getByRole('button', { name: 'Next' })
    await nextBtn.scrollIntoViewIfNeeded()
    await nextBtn.click()

    expect(await page.isVisible('text=Nodes to Stake: 3')).toBeTruthy()

    // Keep track of the transaction hashes that are generated
    const generatedTxHashes: string[] = []

    await page.route(
        'https://node1.testnet.pokt.network/v1/client/rawtx',
        async (route) => {
            // if options request, return 200
            if (route.request().method() === 'OPTIONS') {
                await route.fulfill({
                    status: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                        'Access-Control-Allow-Headers':
                            'Origin, X-Requested-With, Content-Type, Accept',
                    },
                })
                return
            }
            // return a random txhash
            const json = {
                logs: null,
                txhash: Math.random().toString(16).substring(2, 64),
            }
            generatedTxHashes.push(json.txhash)
            await route.fulfill({ json })
        }
    )

    let stakeBtn = page.getByRole('button', { name: "Yes, I'm ready to stake" })
    await stakeBtn.scrollIntoViewIfNeeded()
    await stakeBtn.click()

    expect(await page.isVisible('text=Staking results')).toBeTruthy()

    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Verify that the generated transaction hashes are present on the page
    for (const txHash of generatedTxHashes) {
        // Expect the txHash to be visible on the page
        expect(await page.isVisible(`text=${txHash}`)).toBeTruthy()
    }

    // Intercept download event
    page.on('download', async (download) => {
        // Wait for the download to complete
        const downloadPath = await download.path()
        if (downloadPath) {
            // Read the content of the downloaded file
            const content = fs.readFileSync(downloadPath, 'utf8')

            // Split content into lines
            const lines = content.trim().split('\n')

            // Iterate through lines (skipping the header)
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i]
                const columns = line.split(',')

                // Extract transaction hashes from the CSV
                const stakeTxHash = columns[2].trim()
                const transferTxHash = columns[3].trim()

                // Check that the hashes are in the generatedTxHashes array
                expect(generatedTxHashes).toContain(stakeTxHash)
                expect(generatedTxHashes).toContain(transferTxHash)
            }
        }
    })

    // Click the Export link to start the download
    let exportBtn = page.getByRole('link', {
        name: 'Export',
    })
    await exportBtn.scrollIntoViewIfNeeded()
    await exportBtn.click()

    // Optional: Add a delay to ensure the download handler has time to execute
    await page.waitForTimeout(2000)
})
