import { test, expect } from '@test-setup/fixtures';

import { FlipkartHomePage } from '@/pages/flipkart/flipkart-home.page';
import { FlipkartSearchResultsPage } from '@/pages/flipkart/flipkart-search-results.page';
import { FlipkartProductDetailsPage } from '@/pages/flipkart/flipkart-product-details.page';
import { FlipkartCartPage } from '@/pages/flipkart/flipkart-cart.page';

class FlipkartAddToCartSpec {
    async testSearchAndAddToCart({ page, context, logger, allureReporter, testBase }: any): Promise<void> {
        const homePage = new FlipkartHomePage(page);

        await allureReporter.addStep('Navigate to Flipkart home page');
        await homePage.navigateToHome();
        await homePage.verifyHomePageLoaded();
        await testBase.takeScreenshot('flipkart-home');

        const searchTerm = 'Iphone 17';
        logger.info(`Searching for product: ${searchTerm}`);
        allureReporter.addStep(`Search for product: ${searchTerm}`);
        await homePage.searchForProduct(searchTerm);

        const resultsPage = new FlipkartSearchResultsPage(page);
        await resultsPage.verifyResultsLoaded();
        await testBase.takeScreenshot('flipkart-search-results');

        logger.info('Clicking first non-sponsored product');
        allureReporter.addStep('Click first non-sponsored product');
        const productPage = await resultsPage.clickFirstNonSponsoredItem();

        const pdp = new FlipkartProductDetailsPage(productPage);
        await pdp.verifyProductDetailsLoaded();

        const productTitle = await pdp.getProductTitle();
        logger.info(`Selected product title: ${productTitle}`);
        allureReporter.addStep(`Selected product: ${productTitle}`);
        await testBase.takeScreenshot('flipkart-pdp');

        await allureReporter.addStep('Add product to cart');
        await pdp.clickAddToCart();
        await testBase.takeScreenshot('flipkart-after-add-to-cart');

        const cartPage = new FlipkartCartPage(productPage);
        await allureReporter.addStep('Open cart');
        await cartPage.openCart();
        await cartPage.verifyCartLoaded();
        await testBase.takeScreenshot('flipkart-cart');

        await allureReporter.addStep('Verify correct item present in cart');
        await cartPage.verifyItemInCart(productTitle);

        await expect(productPage).toHaveURL(/cart/i);
    }
}

const spec = new FlipkartAddToCartSpec();

test.describe('Flipkart - Search and Add to Cart', () => {
    test('should add first non-sponsored search result to cart', async ({ page, context, logger, allureReporter, testBase }) => {
        try {
            await spec.testSearchAndAddToCart({ page, context, logger, allureReporter, testBase });
        } catch (error) {
            await testBase.handleTestFailure(error as Error);
            throw error;
        }
    });
});
