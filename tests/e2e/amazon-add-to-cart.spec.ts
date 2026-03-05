import { test, expect } from '@test-setup/fixtures';

import { AmazonHomePage } from '@/pages/amazon/amazon-home.page';
import { AmazonSearchResultsPage } from '@/pages/amazon/amazon-search-results.page';
import { AmazonProductDetailsPage } from '@/pages/amazon/amazon-product-details.page';
import { AmazonCartPage } from '@/pages/amazon/amazon-cart.page';

test.describe('Amazon - Add to cart', () => {
    test('search, select first non-sponsored product, add to cart, and verify cart', async ({
        page,
        logger,
        allureReporter,
    }) => {
        const homePage = new AmazonHomePage(page);
        const resultsPage = new AmazonSearchResultsPage(page);
        const productDetailsPage = new AmazonProductDetailsPage(page);
        const cartPage = new AmazonCartPage(page);

        allureReporter.addStep('Navigate to Amazon homepage');
        logger.info('Navigating to Amazon homepage');
        await homePage.goToHome();
        await homePage.verifyHomeLoaded();

        const searchTerm = 'Wireless Mouse';
        allureReporter.addStep(`Search for product: ${searchTerm}`);
        logger.info(`Searching for: ${searchTerm}`);
        await homePage.searchFor(searchTerm);

        allureReporter.addStep('Select first non-sponsored product from search results');
        logger.info('Selecting first non-sponsored product');
        const selectedTitleFromResults = await resultsPage.selectFirstNonSponsoredProductAndGetTitle();
        expect(selectedTitleFromResults, 'Selected product title from results should not be empty').toBeTruthy();

        allureReporter.addStep('Read product title on details page');
        const selectedTitleFromDetails = await productDetailsPage.getProductTitle();
        expect(selectedTitleFromDetails, 'Product title on details page should not be empty').toBeTruthy();

        // Prefer the details page title for cart assertion, but fall back to results title if needed.
        const expectedTitle = selectedTitleFromDetails || selectedTitleFromResults;

        allureReporter.addStep('Add product to cart');
        logger.info('Adding product to cart');
        await productDetailsPage.addToCart();

        allureReporter.addStep('Open cart');
        logger.info('Opening cart');
        await productDetailsPage.openCart();
        await cartPage.verifyCartLoaded();

        allureReporter.addStep('Verify cart contains expected product and quantity is 1');
        const cartTitle = await cartPage.getFirstCartItemTitle();
        const cartQty = await cartPage.getFirstCartItemQuantity();

        expect(cartTitle, 'Cart item title should not be empty').toBeTruthy();
        expect(
            cartTitle.toLowerCase(),
            `Cart item title should contain expected title. Expected: ${expectedTitle}. Actual: ${cartTitle}`,
        ).toContain(expectedTitle.toLowerCase());
        expect(cartQty, 'Cart item quantity should be 1').toBe(1);

        logger.pass(`Verified cart item and quantity. Title: ${cartTitle}, Qty: ${cartQty}`);
        allureReporter.addStep(`Verified cart item and quantity. Title: ${cartTitle}, Qty: ${cartQty}`);
    });
});
