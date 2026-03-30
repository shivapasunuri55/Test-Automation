import { Page, BrowserContext, Browser } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class ContactsPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    /**
     * Step 4: Click the Contacts link in the application navigation.
     */
    async clickContacts(): Promise<void> {
        this.logStep('Click Contacts link');
        await ActionUtils.click(this.page.getByRole('link', { name: 'Contacts' }), { page: this.page });
    }

    /**
     * Initiate create-contact flow.
     *
     * NOTE: A Create button locator was not provided in the implementation plan.
     * If the application supports direct navigation to the create-contact URL,
     * update this method accordingly; otherwise provide the locator and implement click.
     */
    async createContact(): Promise<void> {
        throw new Error(
            'ContactsPage.createContact() is not implemented because no Create button locator or create-contact URL was provided. ' +
                'Please supply the Create button locator (preferred) or the direct URL path to the create contact form.'
        );
    }
}
