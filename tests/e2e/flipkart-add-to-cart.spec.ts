import { test, expect } from '../../test-setup/fixtures';
import { FlipkartHomePage } from '../../src/pages/flipkart/flipkart-home.page';

// Test Case:
// 1. Launch Chrome and navigate to https://flipkart.com and verify homepage loads successfully.
// 2. Enter "Iphone 17" in the search bar and click enter.
// 3. Click on the first non sponsored item and wait for the product details page to load.
// 4. Click on the add cart icon button on the product detail page and verify the correct item is added or not.

test.describe('Flipkart - Add to cart', () => {
    test('Search and add first non-sponsored item to cart (TODO locators)', async ({ page, logger, allureReporter }) => {
        const flipkartHomePage = new FlipkartHomePage(page);

        await allureReporter.addStep('Navigate to Flipkart home page');
        await page.goto('https://flipkart.com', { waitUntil: 'load' });
        await page.waitForLoadState('networkidle');

        // Basic homepage verification (non-locator based)
        await expect(page).toHaveURL(/flipkart\.com/);
        logger.info('Flipkart homepage loaded');

        await allureReporter.addStep('Search for product: Iphone 17');
        await flipkartHomePage.enterSearchTerm('Iphone 17');

        // ===================== TODO / PLACEHOLDERS =====================
        // TODO: Close login modal if it appears (locator not provided).
        // TODO: Click on the first non-sponsored item in search results (locator not provided).
        // TODO: Wait for Product Details Page (PDP) to load (locator not provided).
        // TODO: Click on Add to Cart button/icon on PDP (locator not provided).
        // TODO: Verify the correct item is added in cart (locator not provided).
        // ===============================================================

        await allureReporter.addStep('TODO steps pending: select item, add to cart, verify cart');
    });
});
