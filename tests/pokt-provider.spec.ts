import { test } from '@playwright/test'
// Import the helper functions created earlier
import {
    importNodeKeys,
    importNonCustodialWallet,
    mockBalanceCheck,
    withResponse,
} from './test-helpers'

test.describe('Balance check with POKT Provider', () => {
    test.beforeEach(async ({ page }) => {
        await importNonCustodialWallet(page)
    })

    test('POKT Provider failing for balance check', async ({ page }) => {
        // Mock the HTTP request to simulate failure
        await page.route(
            'https://node1.testnet.pokt.network/v1/query/balance',
            async (route) => {
                await route.fulfill({ status: 500 })
            }
        )

        await withResponse(page, '**/v1/query/balance', async () => {
            await importNodeKeys(page)
        })

        const walletBalance = page.getByText('Wallet Balance: FAILED')
        await walletBalance.waitFor({ state: 'visible' })
    })

    test('POKT Provider succeeding for balance check', async ({ page }) => {
        await mockBalanceCheck(page, 1e15) // Mock the HTTP request to simulate success
        await importNodeKeys(page)
        const walletBalance = page.getByText(
            'Wallet Balance: 1000000000.000000'
        )
        await walletBalance.waitFor({ state: 'visible' })
    })
})
