import { Page, BrowserContext, Browser, Locator } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class AmazonHomePage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    private searchInput(): Locator {
        // Locator provided by test step mapping
        return this.page.getByLabel('Search\nalt\n+\n/');
    }

    async enterSearchTerm(term: string): Promise<void> {
        this.logStep(`Enter search term: ${term}`);

        await ActionUtils.fill(this.searchInput(), term, { page: this.page });

        // Optional: trigger search once a search-submit locator is provided.
        // For now, press Enter to submit the search.
        await this.searchInput().press('Enter');
        await this.page.waitForLoadState('networkidle');
    }
}
