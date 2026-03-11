import { Browser, BrowserContext, Locator, Page } from '@playwright/test';

import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class FlipkartSearchResultsPage extends BasePage {
    private readonly resultsContainerSelector = "div[data-id], div._1AtVbE";
    private readonly productTileSelector = "div[data-id]";
    private readonly productLinkWithinTileSelector = "a";
    private readonly sponsoredLabelSelector = "text=/^Sponsored$/i";

    // Provided locator mapping (fallback) - not reliable for iPhone results
    private readonly fallbackFirstNonSponsoredLinkSelector =
        "role=link[name=\"Men’s Sandals & Floaters/nUnder ₹199\"]";

    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    async waitForResultsLoaded(timeout: number = 30000): Promise<void> {
        this.logStep('Wait for Flipkart search results to load');
        await this.page.waitForLoadState('networkidle');

        const container = this.page.locator(this.resultsContainerSelector).first();
        await container.waitFor({ state: 'visible', timeout });

        // Ensure at least one product tile is present
        await this.page.locator(this.productTileSelector).first().waitFor({ state: 'visible', timeout });
    }

    /**
     * Clicks the first non-sponsored product in the results list.
     * Returns the Page that contains the product details (may be a new tab).
     */
    async openFirstNonSponsoredResult(timeout: number = 30000): Promise<Page> {
        this.logStep('Open first non-sponsored product from search results');
        await this.waitForResultsLoaded(timeout);

        const tiles = this.page.locator(this.productTileSelector);
        const tileCount = await tiles.count();

        for (let i = 0; i < tileCount; i++) {
            const tile = tiles.nth(i);

            // Skip tiles that are not visible (virtualized/ads)
            if (!(await tile.isVisible())) {
                continue;
            }

            const sponsored = tile.locator(this.sponsoredLabelSelector);
            if (await sponsored.count()) {
                continue;
            }

            const link = tile.locator(this.productLinkWithinTileSelector).first();
            if (!(await link.count())) {
                continue;
            }

            const productPage = await this.clickAndReturnPossiblyNewPage(link, timeout);
            await productPage.waitForLoadState('load');
            await productPage.waitForLoadState('networkidle');
            return productPage;
        }

        // Fallback to provided locator mapping if robust strategy fails
        this.logger.warn('No non-sponsored product tile found; using fallback locator');
        const fallback = this.page.locator(this.fallbackFirstNonSponsoredLinkSelector);
        const productPage = await this.clickAndReturnPossiblyNewPage(fallback, timeout);
        await productPage.waitForLoadState('load');
        await productPage.waitForLoadState('networkidle');
        return productPage;
    }

    private async clickAndReturnPossiblyNewPage(target: Locator, timeout: number): Promise<Page> {
        const context = this.context ?? this.page.context();

        const newPagePromise = context.waitForEvent('page', { timeout }).catch(() => null);
        await ActionUtils.click(target, { page: this.page, timeout });

        const newPage = await newPagePromise;
        if (newPage) {
            await newPage.bringToFront();
            return newPage;
        }

        return this.page;
    }
}
