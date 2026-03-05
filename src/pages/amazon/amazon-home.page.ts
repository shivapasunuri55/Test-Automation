import { Locator } from '@playwright/test';

import { ENV } from '@config/env';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class AmazonHomePage extends BasePage {
    private readonly amazonUrl = 'https://www.amazon.com/';

    private readonly logo = '#nav-logo-sprites';
    private readonly searchInput = '#twotabsearchtextbox';
    private readonly searchSubmitButton = '#nav-search-submit-button';

    getLogo(): Locator {
        return this.getLocator(this.logo);
    }

    getSearchInput(): Locator {
        return this.getLocator(this.searchInput);
    }

    getSearchSubmitButton(): Locator {
        return this.getLocator(this.searchSubmitButton);
    }

    async goToHome(): Promise<void> {
        this.logStep('Navigate to Amazon home page');
        await this.navigateTo(this.amazonUrl);
        await this.page.waitForLoadState('networkidle');
    }

    async verifyHomeLoaded(): Promise<void> {
        this.logStep('Verify Amazon home page loaded');
        await this.page.waitForLoadState('load');

        await this.getLogo().waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
        await this.getSearchInput().waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
        await this.getSearchSubmitButton().waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
    }

    async enterSearchTerm(searchTerm: string): Promise<void> {
        this.logStep(`Enter search term: ${searchTerm}`);
        await ActionUtils.fill(this.getSearchInput(), searchTerm, { page: this.page, timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
    }

    async submitSearch(): Promise<void> {
        this.logStep('Submit search');
        await ActionUtils.clickAndNavigate(this.getSearchSubmitButton(), { page: this.page, timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
    }

    async searchFor(searchTerm: string): Promise<void> {
        await this.enterSearchTerm(searchTerm);
        await this.submitSearch();
    }
}
