import { test, expect } from '../test-setup/fixtures';

import { FlipkartHomePage } from '../src/pages/flipkart-home.page';
import { SearchResultsPage } from '../src/pages/search-results.page';
import { ProductDetailsPage } from '../src/pages/product-details.page';
import { CartPage } from '../src/pages/cart.page';

test('Flipkart - search Iphone 17 and add first non-sponsored product to cart', async ({ page, logger, allureReporter }) => {
    const homePage = new FlipkartHomePage(page);

    allureReporter.addStep('Open Flipkart home page');
    await homePage.openHome();
    await homePage.verifyLoaded();

    allureReporter.addStep('Search for product: Iphone 17');
    await homePage.searchForProduct('Iphone 17');

    const searchResultsPage = new SearchResultsPage(page);

    // TODO: Provide a stable locator for the search results container once available.
    await searchResultsPage.waitForLoaded();

    // TODO: Provide a stable locator for the first non-sponsored product once available.
    // This is intentionally failing to avoid guessing selectors.
    throw new Error(
        'TODO: Missing locator for first non-sponsored product. Update the test to pass a Locator/string to SearchResultsPage.openFirstNonSponsoredProduct(firstResultLocator).'
    );

    // eslint-disable-next-line @typescript-eslint/no-unreachable
    const { productTitle } = await searchResultsPage.openFirstNonSponsoredProduct();

    const productDetailsPage = new ProductDetailsPage(page);
    await productDetailsPage.waitForLoaded();

    const expectedTitle = productTitle ?? (await productDetailsPage.getProductTitle());
    logger.info(`Captured product title: ${expectedTitle}`);

    // TODO: Provide a stable locator for Add to Cart button once available.
    await productDetailsPage.addToCart();

    const cartPage = new CartPage(page);

    // TODO: Provide a stable locator for cart item titles once available.
    await cartPage.verifyItemInCart(expectedTitle);

    // If/when CartPage.verifyItemInCart is updated to use expect(), keep this assertion as a sanity check.
    expect(expectedTitle).toBeTruthy();
});
