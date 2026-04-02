import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export type ContactData = {
    first_name?: string;
    last_name?: string;
    company?: string;
    email_address?: string;
};

export class ContactsPage extends BasePage {
    private readonly contactsLink: Locator;
    private readonly createButton: Locator;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly companyInput: Locator;
    private readonly emailAddressInput: Locator;
    private readonly saveButton: Locator;

    constructor(page: Page) {
        super(page);

        // Step 4
        this.contactsLink = this.page.locator("a[href='/contacts']");

        // Step 5
        // NOTE: ':contains' and broad multi-selectors may not be valid Playwright selectors.
        // Kept as-is per instructions; replace with stable locators after app/repo inspection.
        this.createButton = this.page.locator(
            "button:contains('Create'), a:contains('Create'), .btn:contains('Create'), [data-testid*='create'], .create-btn, #create-contact, .new-contact-btn"
        );

        // Step 6-8
        // Locator values are Playwright expressions; use getByRole directly.
        this.firstNameInput = this.page.getByRole('textbox', { name: 'First Name' });
        this.lastNameInput = this.page.getByRole('textbox', { name: 'Last Name' });
        this.companyInput = this.page.getByRole('textbox', { name: 'Company' });

        // Step 9
        this.emailAddressInput = this.page.locator("input[placeholder='Email address']");

        // Step 10
        // NOTE: ':contains' and broad multi-selectors may not be valid Playwright selectors.
        // Kept as-is per instructions; replace with stable locators after app/repo inspection.
        this.saveButton = this.page.locator(
            "button[type='submit'], input[type='submit'], button:contains('Save'), .btn-primary, [data-testid*='save'], [class*='save']"
        );
    }

    async goToContacts(): Promise<void> {
        this.logStep('Go to Contacts');
        await ActionUtils.click(this.contactsLink, { page: this.page });
        await this.page.waitForLoadState('networkidle');
    }

    async clickCreateContact(): Promise<void> {
        this.logStep('Click Create Contact');
        await ActionUtils.click(this.createButton, { page: this.page });
    }

    async fillFirstName(firstName: string): Promise<void> {
        this.logStep(`Fill First Name: ${firstName}`);
        await ActionUtils.fill(this.firstNameInput, firstName, { page: this.page });
    }

    async fillLastName(lastName: string): Promise<void> {
        this.logStep(`Fill Last Name: ${lastName}`);
        await ActionUtils.fill(this.lastNameInput, lastName, { page: this.page });
    }

    async fillCompany(company: string): Promise<void> {
        this.logStep(`Fill Company: ${company}`);
        await ActionUtils.fill(this.companyInput, company, { page: this.page });
    }

    async fillEmail(email: string): Promise<void> {
        this.logStep(`Fill Email: ${email}`);
        await ActionUtils.fill(this.emailAddressInput, email, { page: this.page });
    }

    async clickSaveContact(): Promise<void> {
        this.logStep('Click Save Contact');
        await ActionUtils.click(this.saveButton, { page: this.page });
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Composite helper to create a contact with the most common fields.
     */
    async createContact(contactData: ContactData): Promise<void> {
        this.logStep('Create contact (composite)');

        if (contactData.first_name) {
            await this.fillFirstName(contactData.first_name);
        }
        if (contactData.last_name) {
            await this.fillLastName(contactData.last_name);
        }
        if (contactData.company) {
            await this.fillCompany(contactData.company);
        }
        if (contactData.email_address) {
            await this.fillEmail(contactData.email_address);
        }

        await this.clickSaveContact();
    }

    /**
     * Verify the contact was created by asserting key details are visible.
     *
     * Since the post-save UI can vary (details page vs list), this uses a flexible
     * text-based assertion against the current page.
     */
    async verifyContactCreated(expected: ContactData): Promise<void> {
        this.logStep('Verify contact created');

        const assertions: Array<Promise<void>> = [];

        if (expected.first_name || expected.last_name) {
            const fullName = `${expected.first_name ?? ''} ${expected.last_name ?? ''}`.trim();
            if (fullName) {
                assertions.push(expect(this.page.getByText(fullName, { exact: false })).toBeVisible());
            }
        }

        if (expected.email_address) {
            assertions.push(expect(this.page.getByText(expected.email_address, { exact: false })).toBeVisible());
        }

        if (assertions.length === 0) {
            throw new Error('verifyContactCreated requires at least a name or email to assert.');
        }

        await Promise.all(assertions);
    }
}
