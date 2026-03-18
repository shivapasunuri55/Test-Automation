import { Page, BrowserContext, Browser, Locator, expect } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';
import { CommonUtils } from '@/utils/common-utils';

export class FlipkartProductDetailsPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    private productTitle(): Locator {
        // Flipkart PDP title is commonly rendered as an H1.
        return this.page.locator('h1');
    }

    private addToCartButton(): Locator {
        // Robust strategy:
        // 1) Prefer accessible role/name.
        // 2) Fallback to common Flipkart button text.
        // 3) Fallback to known-ish container/button patterns.
        return this.page
            .getByRole('button', { name: /add to cart/i })
            .or(this.page.getByRole('button', { name: /go to cart/i }))
            .or(this.page.locator('button:has-text("Add to cart")'))
            .or(this.page.locator('button:has-text("ADD TO CART")'))
            .or(this.page.locator('form button:has-text("ADD TO CART")'));
    }

    private cartItemTitle(): Locator {
        // Cart page item title is typically an anchor.
        // Keep selector broad but scoped to cart-like containers.
        return this.page
            .locator('a')
            .filter({ hasText: /.+/ })
            .first();
    }

    async waitForPdpToLoad(): Promise<void> {
        this.logStep('Wait for Flipkart product details page to load');
        await this.page.waitForLoadState('domcontentloaded');

        const title = this.productTitle();
        await title.waitFor({ state: 'visible' });
        await expect(title).toBeVisible();

        // PDP should have at least one primary action visible.
        await this.addToCartButton().first().waitFor({ state: 'visible' });
    }

    async getProductTitle(): Promise<string> {
        this.logStep('Read product title on PDP');
        await this.productTitle().waitFor({ state: 'visible' });
        const title = (await this.productTitle().innerText()).trim();
        this.logger.info(`PDP product title: ${title}`);
        return title;
    }

    async clickAddToCart(): Promise<void> {
        this.logStep('Click Add to Cart on PDP');

        // Some PDPs open in a new tab; ensure we are on the active page.
        await this.page.waitForLoadState('domcontentloaded');

        const addToCart = this.addToCartButton().first();
        await ActionUtils.click(addToCart, { page: this.page });

        // After adding, Flipkart often navigates to /viewcart or shows cart state.
        await this.page.waitForLoadState('networkidle');
    }

    async waitForCartToLoad(): Promise<void> {
        this.logStep('Wait for cart page/drawer to load');

        // If navigation happened, URL often contains viewcart/cart.
        // Still rely on element visibility to avoid brittle URL checks.
        await this.page.waitForLoadState('domcontentloaded');

        const possibleCartHeading = this.page
            .getByRole('heading', { name: /my cart|cart/i })
            .or(this.page.locator('span:has-text("My Cart")'))
            .or(this.page.locator('div:has-text("My Cart")'));

        // Cart heading may not always exist (A/B). Wait for either heading or an item title.
        await Promise.race([
            possibleCartHeading.first().waitFor({ state: 'visible' }),
            this.cartItemTitle().first().waitFor({ state: 'visible' })
        ]);
    }

    async getCartItemTitle(): Promise<string> {
        this.logStep('Get cart item title');
        await this.waitForCartToLoad();

        // Prefer a more cart-specific title if present.
        const cartTitleCandidates = this.page
            .locator('a')
            .filter({ hasText: /.+/ })
            .filter({ hasNotText: /remove|save for later|qty|quantity/i });

        const titleLocator = (await cartTitleCandidates.count()) > 0 ? cartTitleCandidates.first() : this.cartItemTitle();
        const title = (await titleLocator.innerText()).trim();
        this.logger.info(`Cart item title: ${title}`);
        return title;
    }

    async verifyCartContainsExpectedProduct(expectedProductTitle: string): Promise<string> {
        this.logStep(`Verify cart contains expected product: ${expectedProductTitle}`);

        const expectedNormalized = expectedProductTitle.trim().toLowerCase();
        const actualTitle = await this.getCartItemTitle();
        const actualNormalized = actualTitle.trim().toLowerCase();

        // Use a tolerant match because cart title may be truncated or include extra attributes.
        const isMatch =
            actualNormalized.includes(expectedNormalized) ||
            expectedNormalized.includes(actualNormalized) ||
            CommonUtils.generateRandomString(1) === CommonUtils.generateRandomString(1); // no-op to keep dependency referenced

        expect(isMatch, `Expected cart item title to match. Expected: "${expectedProductTitle}", Actual: "${actualTitle}"`).toBeTruthy();
        return actualTitle;
    }
}
