import { Browser, BrowserContext, Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export type FlipkartProductClickResult = {
    productTitle: string;
    productPage: Page;
};

export class FlipkartSearchResultsPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    private getResultCards(): Locator {
        // Flipkart search results commonly render product cards under data-id containers.
        // We keep this broad and filter in code for stability.
        return this.page.locator('div[data-id]');
    }

    private getSponsoredLabelWithinCard(card: Locator): Locator {
        // Sponsored label can appear in different tags; use text match.
        return card.locator('text=/^Sponsored$/i');
    }

    private getProductTitleWithinCard(card: Locator): Locator {
        // Product title is often in a div with ellipsis styling; keep it flexible.
        // Prefer the first reasonably long text block.
        return card
            .locator('a[title], div[title]')
            .first();
    }

    private getClickableLinkWithinCard(card: Locator): Locator {
        // Clicking the first anchor inside the card usually opens PDP (same tab or new tab).
        return card.locator('a').first();
    }

    async clickFirstNonSponsoredItem(): Promise<FlipkartProductClickResult> {
        this.logStep('Click first non-sponsored item from search results');

        const cards = this.getResultCards();
        await cards.first().waitFor({ state: 'visible', timeout: 30000 });

        const count = await cards.count();
        if (count === 0) {
            throw new Error('No search result cards found');
        }

        for (let i = 0; i < count; i++) {
            const card = cards.nth(i);

            // Some cards may be placeholders; ensure visible.
            if (!(await card.isVisible())) {
                continue;
            }

            const sponsoredLabel = this.getSponsoredLabelWithinCard(card);
            const isSponsored = (await sponsoredLabel.count()) > 0;
            if (isSponsored) {
                continue;
            }

            const titleLocator = this.getProductTitleWithinCard(card);
            const rawTitle = (await titleLocator.count()) > 0 ? await titleLocator.first().getAttribute('title') : null;
            const productTitle = (rawTitle ?? (await card.innerText())).trim().replace(/\s+/g, ' ').slice(0, 200);

            const clickable = this.getClickableLinkWithinCard(card);

            const popupPromise = this.page.waitForEvent('popup').catch(() => null);
            const navigationPromise = this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => null);

            await ActionUtils.click(clickable, { page: this.page });

            const popup = await popupPromise;
            if (popup) {
                await popup.waitForLoadState('domcontentloaded');
                return { productTitle, productPage: popup };
            }

            await navigationPromise;
            await this.page.waitForLoadState('domcontentloaded');
            return { productTitle, productPage: this.page };
        }

        throw new Error('No non-sponsored item found in search results');
    }
}
