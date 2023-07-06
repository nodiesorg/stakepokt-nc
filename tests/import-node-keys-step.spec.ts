import { expect, test } from '@playwright/test'
// Import the helper functions created earlier
import {
    dragAndDropFile,
    importNodeKeys,
    importNonCustodialWallet,
} from './test-helpers'

test.describe('Importing CSV', () => {
    test.beforeEach(async ({ page }) => {
        await importNonCustodialWallet(page)
    })

    test('with Invalid PPK', async ({ page }) => {
        // Simulate importing a CSV file with an invalid PPK
        await dragAndDropFile(
            page,
            './tests/fixtures/nodes-invalid.csv', // path to your invalid csv file
            'nodes-invalid.csv',
            'text/csv',
            '[data-testid="dropzone"]' // Placeholder selector for the CSV dropzone
        )

        // Assert that an error message is displayed
        const error = page.getByText(
            'Selected file: nodes-invalid.csv, nodes detected: 2'
        )
        await error.waitFor()
        expect(await error.isVisible()).toBeTruthy()
    })

    test('with Valid PPK', async ({ page }) => {
        await importNodeKeys(page)
    })
})
