import { test, expect } from '@test-setup/fixtures';

import { FlipkartHomePage } from '@/pages/flipkart/flipkart-home.page';
import { FlipkartSearchResultsPage } from '@/pages/flipkart/flipkart-search-results.page';
import { FlipkartProductDetailsPage } from '@/pages/flipkart/flipkart-product-details.page';

test.describe('Flipkart - Add to cart', () => {
    test('should add the correct item to cart from PDP', async ({ page, logger, allureReporter }) => {
        const searchTerm = 'Iphone 17';

        allureReporter.addTestSuite('Flipkart');
        allureReporter.addTestFeature('Cart');
        allureReporter.addTestStory('Add to cart from PDP');
        allureReporter.addTestSeverity('critical');
        allureReporter.addTestTag('flipkart');
        allureReporter.addTestTag('e2e');

        const homePage = new FlipkartHomePage(page);
        const resultsPage = new FlipkartSearchResultsPage(page);

        logger.info(`Navigating to Flipkart and searching for: ${searchTerm}`);
        allureReporter.addStep(`Navigate to Flipkart and search for: ${searchTerm}`);

        await homePage.navigateToFlipkart();
        await homePage.verifyHomePageLoaded();

        await homePage.searchFor(searchTerm);

        allureReporter.addStep('Click first non-sponsored search result');
        const { productPage } = await resultsPage.clickFirstNonSponsoredItem();

        const pdpPage = new FlipkartProductDetailsPage(productPage);
        await pdpPage.waitForPdpToLoad();

        const pdpTitle = await pdpPage.getProductTitle();
        logger.info(`Selected PDP title: ${pdpTitle}`);
        allureReporter.addStep(`PDP loaded. Title: ${pdpTitle}`);

        await pdpPage.clickAddToCart();
        allureReporter.addStep('Clicked Add to cart');

        await pdpPage.verifyCartContainsExpectedProduct(pdpTitle);
        logger.pass('Verified correct item added to cart');
        allureReporter.addStep('Verified correct item added to cart');

        await expect(productPage).toHaveURL(/cart|viewcart/i);
    });
});
