import { expect, Page } from '@playwright/test';
import { ENV } from '@config/env';
import { ActionUtils } from '@/utils/action-utils';
import { BasePage } from '@/pages/base.page';

export class FlipkartPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private searchInput(): string {
        return "input[name='q']";
    }

    private homeLogo(): string {
        return "a[title='Flipkart']";
    }

    private firstNonSponsoredResultLink(): string {
        // Best-effort selector: first product title link in results grid.
        // (Planner did not provide locators in this step.)
        return "a[href*='/p/']";
    }

    private addToCartButton(): string {
        return "button:has-text('Add to cart'), button:has-text('ADD TO CART')";
    }

    private cartItemTitle(): string {
        return "a[href*='/p/']";
    }

    async navigateToHomeAndVerifyLoaded(): Promise<void> {
        this.logStep('Navigate to Flipkart home and verify loaded');
        await this.navigateTo('https://flipkart.com');

        const search = this.page.locator(this.searchInput());
        await search.waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
        await expect(search).toBeVisible();
        await this.page.waitForLoadState('networkidle');
    }

    async enterSearchTerm(term: string): Promise<void> {
        this.logStep(`Enter search term: ${term}`);
        await ActionUtils.fill(this.searchInput(), term, { page: this.page, timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
    }

    async submitSearchWithEnter(): Promise<void> {
        this.logStep('Submit search with Enter');
        const search = this.page.locator(this.searchInput());
        await search.waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
        await search.press('Enter');
        await this.page.waitForLoadState('networkidle');
    }

    async openFirstNonSponsoredResult(): Promise<void> {
        this.logStep('Open first non-sponsored search result');
        const firstResult = this.page.locator(this.firstNonSponsoredResultLink()).first();
        await firstResult.waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });

        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            firstResult.click(),
        ]);

        await newPage.waitForLoadState('domcontentloaded');
        await newPage.waitForLoadState('networkidle');

        // Switch this page reference to the newly opened product page
        // so subsequent actions operate on the product details page.
        (this as any).page = newPage;
    }

    async addToCartAndVerify(expectedProductName?: string): Promise<void> {
        this.logStep('Add product to cart and verify');

        const addToCart = this.page.locator(this.addToCartButton()).first();
        await addToCart.waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
        await addToCart.click();
        await this.page.waitForLoadState('networkidle');

        // Verify cart has at least one item; optionally verify expected product name.
        const cartItem = this.page.locator(this.cartItemTitle()).first();
        await cartItem.waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
        await expect(cartItem).toBeVisible();

        if (expectedProductName) {
            await expect(cartItem).toContainText(expectedProductName, { ignoreCase: true });
        }
    }
}
