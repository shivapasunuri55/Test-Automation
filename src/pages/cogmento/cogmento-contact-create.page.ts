import { Page, BrowserContext, Browser, Locator } from '@playwright/test';
import { BasePage } from '../base.page';
import { ActionUtils } from '../../utils/action-utils';
import { TestDataUtils } from '../../utils/test-data-utils';

export type CogmentoContactCreateData = {
    firstName?: string;
    lastName?: string;
    company?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
};

export class CogmentoContactCreatePage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    // ==================== LOCATORS ====================

    private firstNameInput(): Locator {
        return this.page.getByLabel('First Name');
    }

    private lastNameInput(): Locator {
        return this.page.getByLabel('Last Name');
    }

    private companyInput(): Locator {
        return this.page.getByLabel('Company');
    }

    private emailInput(): Locator {
        return this.page.locator("input[name='email'], input[placeholder*='email' i], input[type='email'], #email, .email-field");
    }

    private phoneNumberInput(): Locator {
        return this.page.getByLabel('Phone Number');
    }

    private addressInput(): Locator {
        return this.page.getByLabel('Address');
    }

    private cityInput(): Locator {
        return this.page.getByLabel('City');
    }

    private stateInput(): Locator {
        return this.page.getByLabel('State');
    }

    private zipCodeInput(): Locator {
        return this.page.getByLabel('Zip Code');
    }

    private countryInput(): Locator {
        return this.page.getByLabel('Country');
    }

    // ==================== ACTIONS ====================

    async enterFirstName(firstName: string): Promise<void> {
        this.logStep(`Enter First Name: ${firstName}`);
        await ActionUtils.fill(this.firstNameInput(), firstName, { page: this.page });
    }

    async enterLastName(lastName: string): Promise<void> {
        this.logStep(`Enter Last Name: ${lastName}`);
        await ActionUtils.fill(this.lastNameInput(), lastName, { page: this.page });
    }

    async enterCompany(company: string): Promise<void> {
        this.logStep(`Enter Company: ${company}`);
        await ActionUtils.fill(this.companyInput(), company, { page: this.page });
    }

    async enterEmail(email: string): Promise<void> {
        this.logStep(`Enter Email: ${email}`);
        await ActionUtils.fill(this.emailInput(), email, { page: this.page });
    }

    async enterPhoneNumber(phoneNumber: string): Promise<void> {
        this.logStep(`Enter Phone Number: ${phoneNumber}`);
        await ActionUtils.fill(this.phoneNumberInput(), phoneNumber, { page: this.page });
    }

    async enterAddress(address: string): Promise<void> {
        this.logStep(`Enter Address: ${address}`);
        await ActionUtils.fill(this.addressInput(), address, { page: this.page });
    }

    async enterCity(city: string): Promise<void> {
        this.logStep(`Enter City: ${city}`);
        await ActionUtils.fill(this.cityInput(), city, { page: this.page });
    }

    async enterState(state: string): Promise<void> {
        this.logStep(`Enter State: ${state}`);
        await ActionUtils.fill(this.stateInput(), state, { page: this.page });
    }

    async enterZipCode(zipCode: string): Promise<void> {
        this.logStep(`Enter Zip Code: ${zipCode}`);
        await ActionUtils.fill(this.zipCodeInput(), zipCode, { page: this.page });
    }

    async enterCountry(country: string): Promise<void> {
        this.logStep(`Enter Country: ${country}`);
        await ActionUtils.fill(this.countryInput(), country, { page: this.page });
    }

    /**
     * Higher-level helper to fill most contact fields.
     * Note: Save/Submit action is intentionally not included because no Save locator was provided.
     */
    async createContact(data: CogmentoContactCreateData): Promise<void> {
        this.logStep('Create contact - fill most fields');

        if (data.firstName) await this.enterFirstName(data.firstName);
        if (data.lastName) await this.enterLastName(data.lastName);
        if (data.company) await this.enterCompany(data.company);
        if (data.email) await this.enterEmail(data.email);
        if (data.phoneNumber) await this.enterPhoneNumber(data.phoneNumber);
        if (data.address) await this.enterAddress(data.address);
        if (data.city) await this.enterCity(data.city);
        if (data.state) await this.enterState(data.state);
        if (data.zipCode) await this.enterZipCode(data.zipCode);
        if (data.country) await this.enterCountry(data.country);

        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Optional convenience method to load contact data from test-data.json.
     */
    async createContactFromTestData(key: string): Promise<void> {
        const data = TestDataUtils.getTestData(key) as CogmentoContactCreateData;
        await this.createContact(data);
    }
}
