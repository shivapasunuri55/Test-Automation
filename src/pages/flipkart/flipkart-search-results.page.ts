import { expect, Page } from '@playwright/test';

import { ENV } from '@config/env';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class FlipkartSearchResultsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async verifyResultsLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/(\/search\b|[?&]q=)/i, { timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });

        const resultsContainer = this.getResultsContainer();
        await expect(resultsContainer).toBeVisible({ timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });

        const productTiles = this.getProductTiles();
        await expect(productTiles.first()).toBeVisible({ timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
    }

    async clickFirstNonSponsoredItem(): Promise<Page> {
        await this.verifyResultsLoaded();

        const tiles = this.getProductTiles();
        const tileCount = await tiles.count();
        if (tileCount === 0) {
            throw new Error('No product tiles found on search results page');
        }

        for (let i = 0; i < tileCount; i++) {
            const tile = tiles.nth(i);
            const isSponsored = await this.isTileSponsored(tile);
            if (isSponsored) {
                continue;
            }

            const newPagePromise = this.context
                ? this.context.waitForEvent('page').catch(() => null)
                : Promise.resolve(null);
            await ActionUtils.click(tile, { page: this.page, timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });

            const newPage = await newPagePromise;
            if (newPage) {
                await newPage.waitForLoadState('load');
                return newPage;
            }

            await this.page.waitForLoadState('load');
            return this.page;
        }

        throw new Error('No non-sponsored product tile found on search results page');
    }

    private getResultsContainer() {
        return this.getLocator('div._1YokD2, div._1AtVbE');
    }

    private getProductTiles() {
        return this.getLocator('a[href*="/p/"]:visible, a[href*="/product/"]:visible, div[data-id] a:visible');
    }

    private async isTileSponsored(tile: any): Promise<boolean> {
        try {
            const sponsoredLabel = tile.locator('text=/^Sponsored$/i');
            if (await sponsoredLabel.count()) {
                return await sponsoredLabel.first().isVisible({ timeout: 500 });
            }
        } catch {
            // ignore
        }

        try {
            const tileText = (await tile.innerText({ timeout: 1000 })) || '';
            return /\bSponsored\b/i.test(tileText);
        } catch {
            return false;
        }
    }
}
