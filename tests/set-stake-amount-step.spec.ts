import { expect, test } from '@playwright/test'
// Import the helper functions created earlier
import {
    clickNextButton,
    fillAdditionalTransferAmount,
    importNodeKeys,
    importNonCustodialWallet,
    mockBalanceCheck,
} from './test-helpers'

test.describe('Staking with Insufficient and Sufficient Funds', () => {
    test.beforeEach(async ({ page }) => {
        await importNonCustodialWallet(page)
    })

    test('Insufficient Funds for stake amount', async ({ page }) => {
        // Mock the balance check with insufficient funds
        await mockBalanceCheck(page, 1) // Assuming 1 is insufficient for staking
        await importNodeKeys(page)

        // Assert that an error message is displayed indicating insufficient funds
        let nextBtn = page.getByRole('button', {
            name: 'Next',
            disabled: true,
        })
        expect(await nextBtn.isDisabled()).toBeTruthy()
    })

    test('Sufficient Funds for stake amount', async ({ page }) => {
        // Mock the balance check with sufficient funds
        await mockBalanceCheck(page, 1e15) // Assuming 1e15 is sufficient for staking
        await importNodeKeys(page)

        // Fill in additional transfer amount
        await fillAdditionalTransferAmount(page, '5') // Assuming 5 is a valid amount

        await clickNextButton(page)
    })
})
