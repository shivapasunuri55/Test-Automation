import { Page, BrowserContext, Browser, Locator } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class FlipkartPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    private resolveGetByLocator(locator: string): Locator {
        if (locator.startsWith("getByRole(")) {
            const match = locator.match(/getByRole\('([^']+)'\s*,\s*\{\s*name:\s*'([^']+)'\s*\}\)/);
            if (match) {
                const role = match[1] as any;
                const name = match[2];
                return this.page.getByRole(role, { name });
            }
        }

        if (locator.startsWith("getByText(")) {
            const match = locator.match(/getByText\('([^']+)'\)/);
            if (match) {
                return this.page.getByText(match[1]);
            }
        }

        return this.page.locator(locator);
    }

    private resolveLocator(locator: string): Locator {
        return locator.startsWith('getBy') ? this.resolveGetByLocator(locator) : this.page.locator(locator);
    }

    async openHome(url: string): Promise<void> {
        this.logStep(`Open Flipkart home: ${url}`);
        await this.navigateTo(url);
    }

    async closeLoginModal(locator: string): Promise<void> {
        this.logStep('Close login modal');
        const resolved = this.resolveLocator(locator);
        await ActionUtils.click(resolved, { page: this.page });
    }

    async fillSearch(locator: string, value: string): Promise<void> {
        this.logStep(`Fill search: ${value}`);
        const resolved = this.resolveLocator(locator);
        await ActionUtils.fill(resolved, value, { page: this.page });
    }

    async pressEnter(): Promise<void> {
        this.logStep('Press Enter');
        await ActionUtils.pressPageKeyboard('Enter', { page: this.page });
    }

    async clickFirstProductFromResults(locator: string): Promise<void> {
        this.logStep('Click first product from results');
        const resolved = this.resolveLocator(locator);
        await ActionUtils.clickAndNavigate(resolved, { page: this.page });
    }

    async navigateToProductUrl(url: string): Promise<void> {
        this.logStep(`Navigate to product URL: ${url}`);
        await this.navigateTo(url);
    }

    // Placeholder: locator not available from recording yet.
    async clickAddToCart(locator: string): Promise<void> {
        this.logStep('Click Add to Cart');
        const resolved = this.resolveLocator(locator);
        await ActionUtils.click(resolved, { page: this.page });
    }

    // Placeholder: locator not available from recording yet.
    async openCart(locator: string): Promise<void> {
        this.logStep('Open Cart');
        const resolved = this.resolveLocator(locator);
        await ActionUtils.clickAndNavigate(resolved, { page: this.page });
    }
}
