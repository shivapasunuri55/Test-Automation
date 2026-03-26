import { Page, BrowserContext, Browser, Locator } from '@playwright/test';
import { BasePage } from '../base.page';
import { ActionUtils } from '../../utils/action-utils';

export class CogmentoContactsPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    private contactsLink(): Locator {
        return this.page.getByRole('link', { name: 'Contacts' });
    }

    private createContactEntry(): Locator {
        return this.page.locator(
            "input[name='first_name'], input[placeholder*='First'], input[data-field='first_name'], .form-control:first-of-type"
        );
    }

    /**
     * Step 4: Click the Contacts link in the application navigation.
     */
    async goToContacts(): Promise<void> {
        this.logStep('Navigate to Contacts');
        await ActionUtils.click(this.contactsLink(), { page: this.page });
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Step 5: Open the create-contact flow.
     * Uses the provided create-contact entry locator as the focus element to confirm the form is open.
     */
    async openCreateContact(): Promise<void> {
        this.logStep('Open create contact flow');
        await this.page.waitForLoadState('networkidle');
        await this.createContactEntry().waitFor({ state: 'visible' });
    }
}
