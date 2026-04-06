import { Page, Browser, BrowserContext, Locator } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class LoginPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    private resolveLocator(locator: string): Locator {
        const trimmed = locator.trim();

        if (trimmed.startsWith('getByRole')) {
            // eslint-disable-next-line @typescript-eslint/no-implied-eval
            return new Function('page', `return page.${trimmed};`)(this.page) as Locator;
        }

        if (trimmed.startsWith('getByText')) {
            // eslint-disable-next-line @typescript-eslint/no-implied-eval
            return new Function('page', `return page.${trimmed};`)(this.page) as Locator;
        }

        if (trimmed.startsWith('getByLabel')) {
            // eslint-disable-next-line @typescript-eslint/no-implied-eval
            return new Function('page', `return page.${trimmed};`)(this.page) as Locator;
        }

        if (trimmed.startsWith('getByPlaceholder')) {
            // eslint-disable-next-line @typescript-eslint/no-implied-eval
            return new Function('page', `return page.${trimmed};`)(this.page) as Locator;
        }

        if (trimmed.startsWith('getByTestId')) {
            // eslint-disable-next-line @typescript-eslint/no-implied-eval
            return new Function('page', `return page.${trimmed};`)(this.page) as Locator;
        }

        return this.page.locator(locator);
    }

    async fillUsername(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Username: ${value}`);
        await ActionUtils.fill(this.resolveLocator(locator), value, { page: this.page });
    }

    async fillPassword(locator: string, value: string): Promise<void> {
        this.logStep('Fill Password');
        await ActionUtils.fill(this.resolveLocator(locator), value, { page: this.page });
    }

    async clickLogin(locator: string): Promise<void> {
        this.logStep('Click Login');
        await ActionUtils.click(this.resolveLocator(locator), { page: this.page });
    }
}

