import { Page, BrowserContext, Browser, Locator } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export type ContactData = {
    firstName?: string;
    lastName?: string;
    company?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
};

export type ContactLocators = {
    contactsLink: string;
    createContactButton: string;
    firstNameField: string;
    lastNameField: string;
    companyField: string;
    emailField: string;
    phoneNumberField: string;
    addressField: string;
    cityField: string;
    stateField: string;
    zipCodeField: string;
    countryField: string;
    saveButton: string;
};

export class ContactsPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    private resolveLocator(locator: string): Locator {
        // Some provided locators include :contains(), which is not valid CSS in Playwright.
        // We still attempt to use page.locator() as requested; adjust later once validated.
        return this.page.locator(locator);
    }

    private resolveGetByLocator(locator: string): Locator {
        // Locator values like getByRole('textbox', { name: 'First Name' }) are provided as strings.
        // Convert them to actual Playwright getBy* calls.
        if (locator.startsWith("getByRole(")) {
            const match = locator.match(/getByRole\('([^']+)'\s*,\s*\{\s*name:\s*'([^']+)'\s*\}\)/);
            if (match) {
                const role = match[1] as any;
                const name = match[2];
                return this.page.getByRole(role, { name });
            }
        }

        if (locator.startsWith("getByText(")) {
            const match = locator.match(/getByText\('([^']+)'\)/);
            if (match) {
                return this.page.getByText(match[1]);
            }
        }

        // Fallback to locator() for any other string.
        return this.resolveLocator(locator);
    }

    async openContacts(locator: string): Promise<void> {
        this.logStep('Open Contacts');
        const resolved = locator.startsWith('getBy') ? this.resolveGetByLocator(locator) : this.resolveLocator(locator);
        await ActionUtils.click(resolved, { page: this.page });
    }

    async clickCreateContact(locator: string): Promise<void> {
        this.logStep('Click Create Contact');
        const resolved = locator.startsWith('getBy') ? this.resolveGetByLocator(locator) : this.resolveLocator(locator);
        await ActionUtils.click(resolved, { page: this.page });
    }

    async fillFirstName(locator: string, value: string): Promise<void> {
        this.logStep(`Fill First Name: ${value}`);
        const resolved = locator.startsWith('getBy') ? this.resolveGetByLocator(locator) : this.resolveLocator(locator);
        await ActionUtils.fill(resolved, value, { page: this.page });
    }

    async fillLastName(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Last Name: ${value}`);
        const resolved = locator.startsWith('getBy') ? this.resolveGetByLocator(locator) : this.resolveLocator(locator);
        await ActionUtils.fill(resolved, value, { page: this.page });
    }

    async fillCompany(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Company: ${value}`);
        const resolved = locator.startsWith('getBy') ? this.resolveGetByLocator(locator) : this.resolveLocator(locator);
        await ActionUtils.fill(resolved, value, { page: this.page });
    }

    async fillEmail(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Email: ${value}`);
        const resolved = locator.startsWith('getBy') ? this.resolveGetByLocator(locator) : this.resolveLocator(locator);
        await ActionUtils.fill(resolved, value, { page: this.page });
    }

    async fillPhoneNumber(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Phone Number: ${value}`);
        const resolved = locator.startsWith('getBy') ? this.resolveGetByLocator(locator) : this.resolveLocator(locator);
        await ActionUtils.fill(resolved, value, { page: this.page });
    }

    async fillAddress(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Address: ${value}`);
        const resolved = locator.startsWith('getBy') ? this.resolveGetByLocator(locator) : this.resolveLocator(locator);
        await ActionUtils.fill(resolved, value, { page: this.page });
    }

    async fillCity(locator: string, value: string): Promise<void> {
        this.logStep(`Fill City: ${value}`);
        const resolved = locator.startsWith('getBy') ? this.resolveGetByLocator(locator) : this.resolveLocator(locator);
        await ActionUtils.fill(resolved, value, { page: this.page });
    }

    async fillState(locator: string, value: string): Promise<void> {
        this.logStep(`Fill State: ${value}`);
        const resolved = locator.startsWith('getBy') ? this.resolveGetByLocator(locator) : this.resolveLocator(locator);
        await ActionUtils.fill(resolved, value, { page: this.page });
    }

    async fillZipCode(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Zip Code: ${value}`);
        const resolved = locator.startsWith('getBy') ? this.resolveGetByLocator(locator) : this.resolveLocator(locator);
        await ActionUtils.fill(resolved, value, { page: this.page });
    }

    async fillCountry(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Country: ${value}`);
        const resolved = locator.startsWith('getBy') ? this.resolveGetByLocator(locator) : this.resolveLocator(locator);
        await ActionUtils.fill(resolved, value, { page: this.page });
    }

    async clickSaveContact(locator: string): Promise<void> {
        this.logStep('Click Save Contact');
        const resolved = locator.startsWith('getBy') ? this.resolveGetByLocator(locator) : this.resolveLocator(locator);
        await ActionUtils.click(resolved, { page: this.page });
    }

    async createContact(contact: ContactData = {}, locators?: Partial<ContactLocators>): Promise<void> {
        if (locators?.contactsLink) {
            await this.openContacts(locators.contactsLink);
        }

        if (locators?.createContactButton) {
            await this.clickCreateContact(locators.createContactButton);
        }

        if (contact.firstName !== undefined && locators?.firstNameField) {
            await this.fillFirstName(locators.firstNameField, contact.firstName);
        }

        if (contact.lastName !== undefined && locators?.lastNameField) {
            await this.fillLastName(locators.lastNameField, contact.lastName);
        }

        if (contact.company !== undefined && locators?.companyField) {
            await this.fillCompany(locators.companyField, contact.company);
        }

        if (contact.email !== undefined && locators?.emailField) {
            await this.fillEmail(locators.emailField, contact.email);
        }

        if (contact.phone !== undefined && locators?.phoneNumberField) {
            await this.fillPhoneNumber(locators.phoneNumberField, contact.phone);
        }

        if (contact.address !== undefined && locators?.addressField) {
            await this.fillAddress(locators.addressField, contact.address);
        }

        if (contact.city !== undefined && locators?.cityField) {
            await this.fillCity(locators.cityField, contact.city);
        }

        if (contact.state !== undefined && locators?.stateField) {
            await this.fillState(locators.stateField, contact.state);
        }

        if (contact.zip !== undefined && locators?.zipCodeField) {
            await this.fillZipCode(locators.zipCodeField, contact.zip);
        }

        if (contact.country !== undefined && locators?.countryField) {
            await this.fillCountry(locators.countryField, contact.country);
        }

        if (locators?.saveButton) {
            await this.clickSaveContact(locators.saveButton);
        }
    }
}
