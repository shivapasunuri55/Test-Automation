import { test, expect } from '@test-setup/fixtures';

import { FlipkartHomePage } from '@/pages/flipkart/flipkart-home.page';
import { FlipkartSearchResultsPage } from '@/pages/flipkart/flipkart-search-results.page';
import { FlipkartProductDetailsPage } from '@/pages/flipkart/flipkart-product-details.page';
import { FlipkartCartPage } from '@/pages/flipkart/flipkart-cart.page';

/**
 * Flipkart E2E: Search -> open first non-sponsored result -> add to cart -> verify in cart
 */

test.describe('Flipkart - Add to cart', () => {
    test('search open first non-sponsored add to cart', async ({ page, context, browser, testBase, logger, allureReporter }) => {
        const homePage = new FlipkartHomePage(page);
        const resultsPage = new FlipkartSearchResultsPage(page, context, browser);

        await allureReporter.addStep('Open Flipkart homepage');
        await homePage.openHomePage();
        await homePage.verifyHomePageLoaded();
        await testBase.takeScreenshot('flipkart-homepage');

        await allureReporter.addStep("Search for 'Iphone 17'");
        await homePage.enterSearchTerm('Iphone 17');
        await homePage.submitSearchWithEnter();
        await resultsPage.waitForResultsLoaded();
        await testBase.takeScreenshot('flipkart-search-results');

        await allureReporter.addStep('Open first non-sponsored result');
        const productPage = await resultsPage.openFirstNonSponsoredResult();

        const pdpPage = new FlipkartProductDetailsPage(productPage, context, browser);
        await pdpPage.waitForProductDetailsLoaded();
        await testBase.takeScreenshot('flipkart-pdp');

        const productTitle = await pdpPage.getProductTitle();
        logger.info(`Selected product title: ${productTitle}`);
        testBase.attachToAllure('Selected Product Title', productTitle, 'text/plain');

        await allureReporter.addStep('Add product to cart');
        await pdpPage.addToCart();
        await testBase.takeScreenshot('flipkart-after-add-to-cart');

        const cartPage = new FlipkartCartPage(productPage, context, browser);
        await cartPage.waitForCartLoaded();
        await testBase.takeScreenshot('flipkart-cart');

        await allureReporter.addStep('Verify product is present in cart');
        await cartPage.verifyProductInCart(productTitle);

        // Basic sanity assertion: cart page should be open
        await expect(productPage).toHaveURL(/cart|viewcart/i);
    });
});
