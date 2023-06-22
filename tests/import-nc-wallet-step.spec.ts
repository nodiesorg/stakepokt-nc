import { expect, test } from '@playwright/test'
import {
    clickNextButton,
    dragAndDropFile,
    importNonCustodialWallet,
} from './test-helpers'

test.describe('Importing Wallet', () => {
    test('with Invalid PPK', async ({ page }) => {
        await page.goto('/') // Navigate to the import page

        await page.getByRole('textbox').fill('P@assword1')

        // Simulate importing an invalid PPK file
        await dragAndDropFile(
            page,
            './tests/fixtures/keyfile-invalid.json',
            'invalid_keyfile.json',
            'application/json',
            '[data-testid="dropzone"]' // Placeholder selector for the dropzone
        )

        await clickNextButton(page)

        // Assert that an error message is displayed
        const error = page.getByText(
            'Selected file: invalid_keyfile.json, Malformed PPK'
        )
        expect(await error.isVisible()).toBeTruthy()
    })

    test('with Valid PPK', async ({ page }) => {
        await importNonCustodialWallet(page)
    })
})
