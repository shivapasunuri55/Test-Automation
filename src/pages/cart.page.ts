import { Locator, Page, BrowserContext, Browser } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    /**
     * Returns cart item titles using the provided locator.
     *
     * NOTE: No default selector is provided to avoid guessing locators.
     */
    async getCartItemTitles(cartItemTitleLocator: string | Locator): Promise<string[]> {
        const titleLocator =
            typeof cartItemTitleLocator === 'string' ? this.page.locator(cartItemTitleLocator) : cartItemTitleLocator;

        await titleLocator.first().waitFor({ state: 'visible' });
        const titles = await titleLocator.allTextContents();
        return titles.map((t) => t.trim()).filter(Boolean);
    }

    /**
     * Verifies that the expected item title exists in the cart.
     *
     * @param expectedTitle Expected product title (or a stable substring).
     * @param cartItemTitleLocator Optional locator for cart item titles. If omitted, this method will throw
     *                             to avoid guessing selectors.
     */
    async verifyItemInCart(expectedTitle: string, cartItemTitleLocator?: string | Locator): Promise<void> {
        this.logStep(`Verify item in cart: ${expectedTitle}`);

        if (!cartItemTitleLocator) {
            throw new Error(
                'Cart item title locator was not provided. Pass cartItemTitleLocator to verifyItemInCart(expectedTitle, locator).'
            );
        }

        const titles = await this.getCartItemTitles(cartItemTitleLocator);

        if (titles.length === 0) {
            throw new Error('No cart item titles were found using the provided locator.');
        }

        const normalizedExpected = expectedTitle.trim().toLowerCase();
        const found = titles.some((t) => t.toLowerCase().includes(normalizedExpected));

        if (!found) {
            throw new Error(
                `Expected item was not found in cart. Expected to include: "${expectedTitle}". Actual titles: ${JSON.stringify(titles)}`
            );
        }
    }
}
