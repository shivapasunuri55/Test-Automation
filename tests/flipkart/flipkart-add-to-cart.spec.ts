import { test, expect } from '../../test-setup/fixtures';
import { FlipkartPage } from '../../src/pages/flipkart.page';

// Test Steps Covered:
// 1. Launch Chrome and navigate to https://flipkart.com and verify homepage loads successfully.
// 2. Enter "Iphone 17" in the search bar and click enter.
// 3. Click on the first non sponsered item and wait for the product details page to load.
// 4. Click on the add cart icon button on the product detail page and verify the correct item is added or not.

test.describe('Flipkart - Add to cart', () => {
    test('should search product and add first non-sponsored item to cart', async ({ page, logger, allureReporter }) => {
        const flipkartPage = new FlipkartPage(page);

        await test.step('Navigate to Flipkart and verify homepage loads', async () => {
            await flipkartPage.navigateToHomeAndVerifyLoaded();
            await expect(page).toHaveURL(/flipkart\.com/);

            const screenshot = await page.screenshot({ fullPage: true });
            allureReporter.addAttachment('Flipkart Home', screenshot, 'image/png');
            logger.info('Verified Flipkart homepage loaded');
        });

        await test.step('Search for Iphone 17', async () => {
            await flipkartPage.enterSearchTerm('Iphone 17');
            await flipkartPage.submitSearchWithEnter();

            const screenshot = await page.screenshot({ fullPage: true });
            allureReporter.addAttachment('Search Results', screenshot, 'image/png');
            logger.info('Submitted search for Iphone 17');
        });

        let pdpTitle = '';
        await test.step('Open first non-sponsored result and capture PDP title', async () => {
            await flipkartPage.openFirstNonSponsoredResult();

            // Best-effort: capture product title from common PDP title selectors.
            const titleLocator = page
                .locator('span.B_NuCI, h1, [data-testid="product-title"], [class*="title"], [class*="Title"]')
                .first();
            await titleLocator.waitFor({ state: 'visible' });
            pdpTitle = (await titleLocator.innerText()).trim();

            const screenshot = await page.screenshot({ fullPage: true });
            allureReporter.addAttachment('Product Details Page', screenshot, 'image/png');
            logger.info(`Opened PDP. Captured title: ${pdpTitle}`);
        });

        await test.step('Add to cart and verify correct item is added', async () => {
            await flipkartPage.addToCartAndVerify(pdpTitle);

            const cartTitleLocator = page.locator("a[href*='/p/']").first();
            const cartTitle = (await cartTitleLocator.innerText()).trim();

            expect(cartTitle.toLowerCase()).toContain(pdpTitle.toLowerCase());

            const screenshot = await page.screenshot({ fullPage: true });
            allureReporter.addAttachment('Cart', screenshot, 'image/png');
            logger.pass(`Verified cart item matches PDP title. Cart: ${cartTitle}`);
        });
    });
});
