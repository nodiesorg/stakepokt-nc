import { expect, test } from '@playwright/test'
import fs from 'fs'
// Import the helper functions created earlier
import {
    clickButton,
    clickNextButton,
    fillAdditionalTransferAmount,
    importNodeKeys,
    importNonCustodialWallet,
    mockBalanceCheck,
    mockTransaction,
    verifyConfirmationStep,
    withResponse,
} from './test-helpers'

test.describe('Staking Transactions', () => {
    test.beforeEach(async ({ page }) => {
        await importNonCustodialWallet(page)
        await mockBalanceCheck(page, 1e15) // Assuming 1e15 is sufficient for staking
        await withResponse(page, '**/v1/query/balance', async () => {
            await importNodeKeys(page)
        })
        await fillAdditionalTransferAmount(page, '5') // Assuming 5 is a valid amount
        await clickNextButton(page)
        await verifyConfirmationStep(page)
    })

    test('Stake with failed transaction', async ({ page }) => {
        // Mock the transaction HTTP request to fail
        await page.route(
            'https://node1.testnet.pokt.network/v1/client/rawtx',
            async (route) => {
                await route.fulfill({
                    status: 500,
                    body: 'Transaction failed',
                })
            }
        )

        // Attempt to stake
        await withResponse(page, '**/v1/client/rawtx', async () => {
            await clickButton(page, "Yes, I'm ready to stake")
        })

        // Assert that an error message is displayed
        expect(await page.locator('text={}').count()).toBeGreaterThan(0) // probably can do better than this for error message
    })

    test('Stake with successful transaction', async ({ page }) => {
        let txs: string[] = []
        // Mock the transaction HTTP request to succeed
        await mockTransaction(page, 200, txs)

        // Attempt to stake
        await withResponse(page, '**/v1/client/rawtx', async () => {
            await clickButton(page, "Yes, I'm ready to stake")
        })

        // Assert that the staking was successful
        expect(await page.isVisible('text=Staking results')).toBeTruthy()

        const txHashLocs = txs.map((txHash) => page.getByText(txHash))

        // Verify that the generated transaction hashes are present on the page
        await Promise.all(
            txHashLocs.map((loc) => loc.waitFor({ state: 'visible' }))
        )

        const downloadPromise = page.waitForEvent('download')

        // Click the Export link to start the download
        let exportBtn = page.getByRole('link', {
            name: 'Export',
        })
        await exportBtn.scrollIntoViewIfNeeded()
        await exportBtn.click()

        // Wait for the download to complete
        await downloadPromise.then(async (download) => {
            // Save the downloaded file to a temporary location
            const downloadPath = './tests/fixtures/transactions.csv'
            await download.saveAs(downloadPath)
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
                    expect(txs).toContain(stakeTxHash)
                    expect(txs).toContain(transferTxHash)
                }
            }
        })
    })
})
