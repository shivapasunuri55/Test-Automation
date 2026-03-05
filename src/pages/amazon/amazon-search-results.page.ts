import { Locator } from '@playwright/test';

import { ENV } from '@config/env';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class AmazonSearchResultsPage extends BasePage {
    private readonly resultsContainer = 'div.s-main-slot';
    private readonly resultTile = 'div.s-main-slot div[data-component-type="s-search-result"]';
    private readonly sponsoredLabel = 'span:has-text("Sponsored")';
    private readonly productTitleLink = 'h2 a';

    getResultsContainer(): Locator {
        return this.getLocator(this.resultsContainer);
    }

    getResultTiles(): Locator {
        return this.getLocator(this.resultTile);
    }

    async waitForResults(): Promise<void> {
        this.logStep('Wait for Amazon search results to load');
        await this.page.waitForLoadState('load');
        await this.getResultsContainer().waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
        await this.getResultTiles().first().waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
    }

    private async isSponsoredTile(tile: Locator): Promise<boolean> {
        const sponsored = tile.locator(this.sponsoredLabel);
        return (await sponsored.count()) > 0;
    }

    private async getTileTitle(tile: Locator): Promise<string> {
        const title = await tile.locator(this.productTitleLink).first().innerText();
        return title.trim();
    }

    async selectFirstNonSponsoredProductAndGetTitle(): Promise<string> {
        this.logStep('Select first non-sponsored product from search results');
        await this.waitForResults();

        const tiles = this.getResultTiles();
        const tileCount = await tiles.count();

        for (let i = 0; i < tileCount; i++) {
            const tile = tiles.nth(i);
            await tile.scrollIntoViewIfNeeded();

            if (await this.isSponsoredTile(tile)) {
                continue;
            }

            const title = await this.getTileTitle(tile);
            const link = tile.locator(this.productTitleLink).first();

            await ActionUtils.clickAndNavigate(link, { page: this.page, timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
            await this.page.waitForLoadState('load');
            await this.page.waitForLoadState('networkidle');

            return title;
        }

        throw new Error('No non-sponsored product found in Amazon search results');
    }
}
