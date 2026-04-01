import { test, expect } from '@test-setup/fixtures';
import { TestBase } from '@test-base/testBase';
import { FlipkartPage } from '@/pages/flipkart.page';

// Hook into the project's TestBase lifecycle (pattern used across the framework)
TestBase.beforeEach(async () => {
    // Intentionally empty: framework initializes page/context/browser and clears storage.
});

TestBase.afterEach(async () => {
    // Intentionally empty: framework handles failure artifacts + teardown.
});

test.describe('Flipkart - Add to Cart', () => {
    test('Flipkart search and add to cart (Iphone 17)', async ({ testBase }) => {
        const page = testBase.pageInstance;
        expect(page, 'TestBase did not initialize Playwright page fixture').toBeTruthy();

        const flipkartPage = new FlipkartPage(page!);

        // Step 1: Navigate to Flipkart and verify homepage loads
        await flipkartPage.navigateToHome('https://flipkart.com');
        await page!.waitForLoadState('load');

        // TODO: Add a stable homepage "loaded" locator assertion once provided (e.g., logo/search bar visibility).
        // For now, we only validate that navigation succeeded and the page has a non-empty title.
        await expect(page!, 'Flipkart homepage did not load (empty title after navigation)').toHaveTitle(/.+/);

        // Step 2: Search for product
        await flipkartPage.searchForProduct('Iphone 17');

        // Step 3-4: STOP here because required locators are not provided.
        // TODO: Provide locator for the first non-sponsored item in search results.
        // TODO: Provide locator for the Add to Cart icon/button on the product details page.
        // TODO: Provide locator(s) to verify the correct item is present in the cart.
        throw new Error(
            'BLOCKED: Missing locators for (1) first non-sponsored item, (2) add-to-cart button/icon, and (3) cart verification. ' +
            'Provide these locators to implement steps 3-4.'
        );
    });
});
