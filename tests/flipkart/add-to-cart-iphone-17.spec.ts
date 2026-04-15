import { test, expect } from '../../test-setup/fixtures';
import { BasePage } from '@/pages/base.page';
import { FlipkartPage } from '@/pages/flipkart.page';

test.describe('Flipkart', () => {
    test('Search Iphone 17 and add first non-sponsored item to cart', async ({ page, context, browser, logger }) => {
        const basePage = new (class extends BasePage { })(page, context, browser);
        const flipkartPage = new FlipkartPage(page, context, browser);

        // Step 7: Navigate to Flipkart homepage (use BasePage navigation ownership)
        await basePage.navigateTo('https://flipkart.com');

        // Homepage verification
        await expect(page).toHaveURL(/flipkart\.com/);
        await expect(page.getByRole('textbox', { name: 'Search for Products, Brands' })).toBeVisible();

        // Step 8: Close login/signup modal
        await flipkartPage.closeLoginModal("getByRole('button', { name: '✕' })");

        // Step 1: Fill search
        await flipkartPage.fillSearch(
            "getByRole('textbox', { name: 'Search for Products, Brands' })",
            'Iphone 17'
        );

        // Step 2: Press Enter
        await flipkartPage.pressEnter();

        // Step 3: Click first recorded product link
        await flipkartPage.clickFirstProductFromResults(
            "getByRole('link', { name: 'Bestseller Apple iPhone 17 (Black, 256 GB) Add to Compare Apple iPhone 17 (' })"
        );

        // Step 4: Navigate directly to recorded product URL
        await flipkartPage.navigateToProductUrl(
            'https://www.flipkart.com/apple-iphone-17-black-256-gb/p/itm6eb39da622cdd?pid=MOBHFN6YN2HXB5HE&lid=LSTMOBHFN6YN2HXB5HER9QXGU&marketplace=FLIPKART&q=Iphone+17&store=tyy%2F4io&spotlightTagId=default_BestsellerId_tyy%2F4io&srno=s_1_1&otracker=search&otracker1=search&fm=Search&iid=20cd7355-5fd2-45fd-a2a1-bb38b82ce13b.MOBHFN6YN2HXB5HE.SEARCH&ppt=sp&ppn=sp&ssid=xs0a63rmjk0000001776076869723&qH=d551af8cc25073b3&ov_redirect=true'
        );

        // Product page verification
        await expect(page).toHaveURL(/apple-iphone-17/);

        // Step 5: Add to cart (missing locator from recording)
        // TODO: Provide locator for add-to-cart button/icon from recording.
        logger.error('Missing locator for add-to-cart/cart steps from recording');
        throw new Error('Missing locator for add-to-cart/cart steps from recording');

        // Step 6: Open cart (missing locator from recording)
        // TODO: Provide locator for cart link/button from recording.
        // await flipkartPage.openCart('<MISSING_LOCATOR>');
    });
});
