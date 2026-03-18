import { Page, BrowserContext, Browser, Locator } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class FlipkartSearchResultsPage extends BasePage {
    private clickedProductTitle: string | null = null;

    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    private get resultsContainer(): Locator {
        // Primary results container (defensive selectors)
        return this.getLocator('div._1YokD2, div:has([data-id]), div:has(a[href*="/p/"])');
    }

    private get productCardLinks(): Locator {
        // Common product link selector in Flipkart search results
        return this.getLocator('a[href*="/p/"]');
    }

    private get sponsoredLabel(): Locator {
        // Sponsored label often appears as text "Sponsored" within a card
        return this.getLocator('text=/^Sponsored$/i');
    }

    async waitForResultsPageLoaded(): Promise<void> {
        this.logStep('Wait for Flipkart search results page to load');
        await this.page.waitForLoadState('networkidle');
        await this.resultsContainer.first().waitFor({ state: 'visible', timeout: 30000 });
    }

    getClickedProductTitle(): string | null {
        return this.clickedProductTitle;
    }

    private async captureTitleFromCard(card: Locator): Promise<string> {
        // Try common title patterns within a product card
        const titleCandidates = [
            card.locator('div.KzDlHZ'),
            card.locator('a[title]'),
            card.locator('div[title]'),
            card.locator('span[title]'),
            card.locator('div:has-text("Apple")').first()
        ];

        for (const candidate of titleCandidates) {
            try {
                if (await candidate.first().isVisible({ timeout: 1000 })) {
                    const title = (await candidate.first().getAttribute('title')) || (await candidate.first().innerText());
                    const normalized = title?.trim();
                    if (normalized) return normalized;
                }
            } catch {
                // ignore and try next
            }
        }

        // Fallback: use card text (trimmed)
        const text = (await card.innerText()).trim();
        return text.split('\n').map(t => t.trim()).filter(Boolean)[0] || text;
    }

    private async findFirstNonSponsoredProductLink(): Promise<Locator> {
        const links = this.productCardLinks;
        const count = await links.count();
        if (count === 0) {
            throw new Error('No product links found on search results page');
        }

        // Fallback logic: iterate cards and skip those containing Sponsored label
        for (let i = 0; i < count; i++) {
            const link = links.nth(i);
            const card = link.locator(
                'xpath=ancestor::div[contains(@class,"tUxRFH") or contains(@class,"slAVV4") or contains(@class,"_75nlfW") or contains(@class,"_1AtVbE")][1]'
            );
            try {
                // If we can detect sponsored label within the card, skip
                const sponsoredInCard = card.locator('text=/^Sponsored$/i');
                if (await sponsoredInCard.first().isVisible({ timeout: 500 })) {
                    continue;
                }
            } catch {
                // If detection fails, treat as non-sponsored
            }

            return link;
        }

        // If all appear sponsored (or detection unreliable), return first link
        return links.first();
    }

    async clickFirstNonSponsoredItem(): Promise<Page> {
        this.logStep('Click first non-sponsored item from search results');
        await this.waitForResultsPageLoaded();

        const productLink = await this.findFirstNonSponsoredProductLink();

        // Capture title before click (best-effort)
        try {
            const card = productLink.locator(
                'xpath=ancestor::div[contains(@class,"tUxRFH") or contains(@class,"slAVV4") or contains(@class,"_75nlfW") or contains(@class,"_1AtVbE")][1]'
            );
            this.clickedProductTitle = await this.captureTitleFromCard(card);
        } catch {
            this.clickedProductTitle = null;
        }

        // Handle new tab/window if it opens
        const popupPromise = this.page.waitForEvent('popup').catch(() => null);
        await ActionUtils.click(productLink, { page: this.page });

        const popup = await popupPromise;
        const targetPage = popup ?? this.page;
        await targetPage.waitForLoadState('domcontentloaded');
        await targetPage.waitForLoadState('networkidle');

        return targetPage;
    }
}
