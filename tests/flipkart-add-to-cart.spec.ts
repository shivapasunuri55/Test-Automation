import { test, expect } from '@test-setup/fixtures';
import { FlipkartPage } from '@/pages/flipkart.page';

test.describe('Flipkart - Add to cart (placeholder)', () => {
    test('Search iPhone and open first non-sponsored item', async ({ page, logger, allureReporter }) => {
        const flipkartPage = new FlipkartPage(page);

        allureReporter.addStep('Navigate to Flipkart homepage');
        await flipkartPage.navigateToFlipkart();

        // Verify homepage loaded
        await expect(page).toHaveURL(/flipkart\.com/i);
        await expect(page).toHaveTitle(/Flipkart/i);

        logger.info('Searching for Iphone 17');
        allureReporter.addStep('Enter search term');
        await flipkartPage.enterSearchTerm('Iphone 17');

        allureReporter.addStep('Submit search with Enter');
        await flipkartPage.submitSearchWithEnter();

        allureReporter.addStep('Open first non-sponsored item');
        await flipkartPage.openFirstNonSponsoredItem();

        // Verify product details page loaded (placeholder assertion until PDP locator is available)
        await expect(page).not.toHaveURL(/search/i);

        // TODO: Add-to-cart action + verification
        // - Click on the add-to-cart button/icon on PDP
        // - Verify correct item is added to cart (cart page/mini-cart assertions)
    });
});
