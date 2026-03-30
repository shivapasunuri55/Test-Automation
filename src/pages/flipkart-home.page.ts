import { Locator, Page, BrowserContext, Browser } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class FlipkartHomePage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    async openHome(url: string = 'https://flipkart.com'): Promise<void> {
        await this.navigateTo(url);
    }

    getSearchBar(): Locator {
        return this.page.getByLabel('Search for products, brands and more');
    }

    async verifyLoaded(): Promise<void> {
        await this.getSearchBar().waitFor({ state: 'visible' });
    }

    async searchForProduct(query: string): Promise<void> {
        await ActionUtils.fillAndEnter(this.getSearchBar(), query, { page: this.page });
    }
}
