import { test } from '@playwright/test'
// Import the helper functions created earlier
import {
    clickNextButton,
    fillAdditionalTransferAmount,
    importNodeKeys,
    importNonCustodialWallet,
    mockBalanceCheck,
    verifyConfirmationStep,
    withResponse,
} from './test-helpers'

test.describe('Confirmation Step', () => {
    test.beforeEach(async ({ page }) => {
        await importNonCustodialWallet(page)
        await mockBalanceCheck(page, 1e15) // Assuming 1e15 is sufficient for staking
        await withResponse(page, '**/v1/query/balance', async () => {
            await importNodeKeys(page)
        })
        await fillAdditionalTransferAmount(page, '5') // Assuming 5 is a valid amount
        await clickNextButton(page)
    })

    test('Populated Table', async ({ page }) => {
        await verifyConfirmationStep(page)
    })
})
