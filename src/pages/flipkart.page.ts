import { Browser, BrowserContext, Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class FlipkartPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    /**
     * Navigate to Flipkart home page and wait for the page to be fully loaded.
     */
    async navigateToHome(url: string): Promise<void> {
        this.logStep(`Navigate to Flipkart home: ${url}`);
        await super.navigateTo(url);
        await this.page.waitForLoadState('load');
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Fill the search input labeled "Search for products, brands and more" and press Enter.
     * Locator source (provided): getByLabel('Search for products, brands and more')
     */
    async searchForProduct(query: string): Promise<void> {
        this.logStep(`Search for product: ${query}`);

        const searchInput = this.page.getByLabel('Search for products, brands and more');
        await ActionUtils.fill(searchInput, query, { page: this.page });
        await searchInput.press('Enter');
        await this.page.waitForLoadState('networkidle');
    }

    // ==================== PLACEHOLDERS FOR STEPS 3-4 ====================

    /**
     * Step 3 placeholder: Click the first non-sponsored item.
     *
     * Provide a Locator or selector for the first non-sponsored item.
     */
    async clickFirstNonSponsoredItem(item: Locator | string): Promise<void> {
        if (!item) {
            throw new Error(
                'Missing locator for first non-sponsored item. Provide a Locator or selector string to clickFirstNonSponsoredItem(item).'
            );
        }

        this.logStep('Click first non-sponsored item');
        await ActionUtils.clickAndNavigate(item, { page: this.page });
    }

    /**
     * Step 4 placeholder: Click Add to Cart on product details page.
     *
     * Provide a Locator or selector for the Add to Cart button/icon.
     */
    async addToCart(addToCartButton: Locator | string): Promise<void> {
        if (!addToCartButton) {
            throw new Error(
                'Missing locator for Add to Cart. Provide a Locator or selector string to addToCart(addToCartButton).'
            );
        }

        this.logStep('Add product to cart');
        await ActionUtils.click(addToCartButton, { page: this.page });
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Step 4 placeholder: Verify correct item is added to cart.
     *
     * Provide a Locator or selector for the cart item title/identifier and the expected text.
     */
    async verifyCartItem(cartItemTitle: Locator | string, expectedText: string): Promise<void> {
        if (!cartItemTitle) {
            throw new Error(
                'Missing locator for cart item title. Provide a Locator or selector string to verifyCartItem(cartItemTitle, expectedText).'
            );
        }
        if (!expectedText) {
            throw new Error('Expected cart item text is required for verifyCartItem(cartItemTitle, expectedText).');
        }

        this.logStep(`Verify cart item contains: ${expectedText}`);
        const locator = typeof cartItemTitle === 'string' ? this.page.locator(cartItemTitle) : cartItemTitle;
        await locator.waitFor({ state: 'visible', timeout: 30000 });

        // Intentionally not asserting here until test spec provides expectation strategy.
        // Consumers can use Playwright expect(locator).toContainText(expectedText) in the test layer.
    }
}
