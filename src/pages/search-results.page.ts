import { Browser, BrowserContext, Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class SearchResultsPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    /**
     * Wait for search results page to be loaded.
     *
     * IMPORTANT: No stable locator for the results container is provided yet.
     * Pass a locator (Locator) or selector string once available.
     */
    async waitForLoaded(resultsContainerLocator?: string | Locator): Promise<void> {
        if (!resultsContainerLocator) {
            this.logger.warn(
                'SearchResultsPage.waitForLoaded called without resultsContainerLocator. Provide a locator/selector once available.'
            );
            return;
        }

        const locator = typeof resultsContainerLocator === 'string'
            ? this.page.locator(resultsContainerLocator)
            : resultsContainerLocator;

        await locator.waitFor({ state: 'visible' });
    }

    /**
     * Click the first non-sponsored product in the results.
     *
     * IMPORTANT: No locator for "first non-sponsored item" is provided yet.
     * This method accepts an optional locator/selector so tests can supply it later.
     *
     * Handles both same-tab navigation and new-tab opening.
     */
    async openFirstNonSponsoredProduct(
        firstResultLocator?: string | Locator
    ): Promise<{ productTitle?: string } | void> {
        if (!firstResultLocator) {
            this.logger.warn(
                'SearchResultsPage.openFirstNonSponsoredProduct called without firstResultLocator. Provide a locator/selector once available.'
            );
            return;
        }

        const productLocator = typeof firstResultLocator === 'string'
            ? this.page.locator(firstResultLocator)
            : firstResultLocator;

        const productTitle = (await productLocator.innerText().catch(() => undefined))?.trim();

        const popupPromise = this.page.waitForEvent('popup').catch(() => null);
        const navigationPromise = this.page.waitForNavigation({ waitUntil: 'load' }).catch(() => null);

        await ActionUtils.click(productLocator, { page: this.page });

        const popup = await popupPromise;
        if (popup) {
            await popup.waitForLoadState('load');
            return { productTitle };
        }

        await navigationPromise;
        await this.page.waitForLoadState('domcontentloaded');

        return { productTitle };
    }
}
