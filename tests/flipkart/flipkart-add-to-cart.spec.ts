import { test, expect } from '@test-setup/fixtures';

import { FlipkartHomePage } from '@/pages/flipkart/flipkart-home.page';
import { FlipkartSearchResultsPage } from '@/pages/flipkart/flipkart-search-results.page';
import { FlipkartProductDetailsPage } from '@/pages/flipkart/flipkart-product-details.page';

test.describe('Flipkart - Add to cart', () => {
    test('should add first non-sponsored search result to cart and verify item', async ({ page, logger, allureReporter, testBase }) => {
        const homePage = new FlipkartHomePage(page);
        const resultsPage = new FlipkartSearchResultsPage(page);

        await allureReporter.addStep('Navigate to Flipkart and verify home page');
        await homePage.navigateToFlipkart();
        await homePage.verifyHomePageLoaded();
        await testBase.takeScreenshot('flipkart-home');

        const searchText = 'Iphone 17';
        await allureReporter.addStep(`Search for product: ${searchText}`);
        await homePage.enterSearchText(searchText);
        await homePage.submitSearchWithEnter();

        await resultsPage.waitForResultsPageLoaded();
        await testBase.takeScreenshot('flipkart-search-results');

        await allureReporter.addStep('Open first non-sponsored product from results');
        const pdpPageHandle = await resultsPage.clickFirstNonSponsoredItem();

        const pdpPage = new FlipkartProductDetailsPage(pdpPageHandle);
        await pdpPage.waitForPdpToLoad();
        await testBase.takeScreenshot('flipkart-pdp');

        const productTitle = await pdpPage.getProductTitle();
        logger.info(`Selected product title: ${productTitle}`);
        allureReporter.addAttachment('Selected Product Title', productTitle, 'text/plain');

        await allureReporter.addStep('Add product to cart');
        await pdpPage.clickAddToCart();
        await pdpPage.waitForCartToLoad();
        await testBase.takeScreenshot('flipkart-cart');

        const cartTitle = await pdpPage.getCartItemTitle();
        allureReporter.addAttachment('Cart Item Title', cartTitle, 'text/plain');

        // Tolerant assertion: cart title may include extra attributes or be truncated.
        expect(cartTitle.toLowerCase()).toContain(productTitle.toLowerCase().slice(0, Math.min(20, productTitle.length)));
    });
});
