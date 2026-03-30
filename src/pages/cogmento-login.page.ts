import { Page, BrowserContext, Browser } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class CogmentoLoginPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    async fillUsername(username: string): Promise<void> {
        this.logStep(`Fill username: ${username}`);
        await ActionUtils.fill(this.page.getByLabel('Username'), username, { page: this.page });
    }

    async fillPassword(password: string): Promise<void> {
        this.logStep('Fill password');
        await ActionUtils.fill(this.page.getByLabel('Password'), password, { page: this.page });
    }

    async clickLogin(): Promise<void> {
        this.logStep('Click Login');
        await ActionUtils.click(this.page.getByRole('button', { name: 'Login' }), { page: this.page });
    }

    async login(username: string, password: string): Promise<void> {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLogin();
    }
}
