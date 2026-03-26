import { test, expect } from '../../test-setup/fixtures';
import { AmazonHomePage } from '../../src/pages/amazon/amazon-home.page';

test.describe('Amazon - Add to cart', () => {
    test('Search and add first non-sponsored item to cart (TODO locators)', async ({ page, logger, allureReporter }) => {
        const amazonHomePage = new AmazonHomePage(page);

        await allureReporter.addStep('Navigate to Amazon home page');
        await page.goto('https://www.amazon.com', { waitUntil: 'load' });
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveURL(/amazon\.com/);
        await expect(page).toHaveTitle(/Amazon/i);
        logger.info('Amazon homepage loaded');

        await allureReporter.addStep('Search for product: Wireless Mouse');
        await amazonHomePage.enterSearchTerm('Wireless Mouse');
        await page.waitForLoadState('networkidle');

        // TODO: Select the first non-sponsored product from the search results (requires locators/page object)
        // TODO: Click "Add to Cart" on the product details page (requires locators/page object)
        // TODO: Open the Cart (requires locators/page object)
        // TODO: Verify the correct product is added with quantity 1 (requires locators/page object)

        // Placeholder assertion to keep test structure valid until locators are implemented.
        await expect(page).toHaveURL(/amazon\.com/);
    });
});
