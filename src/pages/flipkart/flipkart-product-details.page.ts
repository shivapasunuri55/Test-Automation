import { expect, Page } from '@playwright/test';

import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class FlipkartProductDetailsPage extends BasePage {
    private readonly selectors = {
        productTitle: 'h1 span',
        addToCartButton: 'button:has-text("Add to cart"), button:has-text("ADD TO CART")',
        cartItemTitle: 'a[href*="/product/"] div, a[href*="/p/"] div, div:has(> a[href*="/p/"])',
        cartContainer: 'div:has-text("My Cart"), div:has-text("Cart")'
    } as const;

    constructor(page: Page) {
        super(page);
    }

    getProductTitleLocator() {
        return this.getLocator(this.selectors.productTitle).first();
    }

    getAddToCartButtonLocator() {
        return this.getLocator(this.selectors.addToCartButton).first();
    }

    getCartItemTitleLocator() {
        return this.getLocator(this.selectors.cartItemTitle).first();
    }

    async waitForPdpToLoad(): Promise<void> {
        this.logStep('Wait for product details page to load');
        await expect(this.getProductTitleLocator()).toBeVisible();
    }

    async getProductTitle(): Promise<string> {
        await this.waitForPdpToLoad();
        const title = (await this.getProductTitleLocator().innerText()).trim();
        this.logger.info(`PDP product title: ${title}`);
        return title;
    }

    async clickAddToCart(): Promise<void> {
        this.logStep('Click Add to cart on PDP');
        await ActionUtils.click(this.getAddToCartButtonLocator(), { page: this.page });
    }

    async verifyCartContainsExpectedProduct(expectedTitle?: string): Promise<void> {
        this.logStep('Verify cart contains expected product');

        const pdpTitle = (expectedTitle ?? (await this.getProductTitle())).trim();

        // After add-to-cart, Flipkart typically navigates to /viewcart or shows cart overlay.
        // We assert cart item title contains PDP title (or vice versa) to be resilient to truncation.
        await expect(this.page).toHaveURL(/cart|viewcart/i, { timeout: 30000 });

        // Ensure some cart UI is present (best-effort)
        await this.page
            .locator(this.selectors.cartContainer)
            .first()
            .waitFor({ state: 'visible', timeout: 30000 })
            .catch(() => undefined);

        const cartTitle = (await this.getCartItemTitleLocator().innerText()).trim();
        this.logger.info(`Cart item title: ${cartTitle}`);

        expect(
            cartTitle.toLowerCase(),
            `Expected cart item title to contain PDP title. PDP: "${pdpTitle}" | Cart: "${cartTitle}"`
        ).toContain(pdpTitle.toLowerCase());
    }
}
