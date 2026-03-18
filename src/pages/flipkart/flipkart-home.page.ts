import { expect, Page, Browser, BrowserContext, Locator } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';
import { ENV } from '@config/env';

export class FlipkartHomePage extends BasePage {
    private readonly searchInputSelector = 'input[name="q"]';

    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    getSearchInput(): Locator {
        return this.getLocator(this.searchInputSelector);
    }

    async navigateToFlipkart(): Promise<void> {
        const url = ENV.BASE_URL || 'https://flipkart.com';
        this.logStep(`Navigate to Flipkart: ${url}`);
        await this.navigateTo(url);
    }

    async verifyHomePageLoaded(): Promise<void> {
        this.logStep('Verify Flipkart homepage loaded');
        await expect(this.page).toHaveTitle(/flipkart/i);
        await expect(this.getSearchInput()).toBeVisible();
    }

    async enterSearchTerm(searchTerm: string): Promise<void> {
        this.logStep(`Enter search term: ${searchTerm}`);
        await ActionUtils.fill(this.getSearchInput(), searchTerm, { page: this.page });
    }

    async pressEnterOnSearch(): Promise<void> {
        this.logStep('Press Enter on search input');
        await this.getSearchInput().press('Enter');
    }

    async searchFor(searchTerm: string): Promise<void> {
        this.logStep(`Search for: ${searchTerm}`);
        await ActionUtils.fillAndEnter(this.getSearchInput(), searchTerm, { page: this.page });
    }
}
