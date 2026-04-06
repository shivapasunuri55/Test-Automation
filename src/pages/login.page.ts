import { Page, BrowserContext, Browser } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class LoginPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    async fillUsername(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Username: ${value}`);

        // Locator rule: if locator starts with getBy* use this.page.getBy* directly.
        if (locator.startsWith('getBy')) {
            await ActionUtils.fill(this.page.getByRole('textbox', { name: 'Username' }), value, { page: this.page });
            return;
        }

        await ActionUtils.fill(this.page.locator(locator), value, { page: this.page });
    }

    async fillPassword(locator: string, value: string): Promise<void> {
        this.logStep('Fill Password');

        if (locator.startsWith('getBy')) {
            await ActionUtils.fill(this.page.getByRole('textbox', { name: 'Password' }), value, { page: this.page });
            return;
        }

        await ActionUtils.fill(this.page.locator(locator), value, { page: this.page });
    }

    async clickLogin(locator: string): Promise<void> {
        this.logStep('Click Login');

        if (locator.startsWith('getBy')) {
            await ActionUtils.click(this.page.getByRole('button', { name: 'Login' }), { page: this.page });
            return;
        }

        await ActionUtils.click(this.page.locator(locator), { page: this.page });
    }
}
