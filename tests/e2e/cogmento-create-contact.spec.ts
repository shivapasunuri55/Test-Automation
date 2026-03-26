import { test, expect } from '../../test-setup/fixtures';
import { config } from '@config/env';
import { CogmentoLoginPage } from '../../src/pages/cogmento/cogmento-login.page';
import { CogmentoContactsPage } from '../../src/pages/cogmento/cogmento-contacts.page';
import { CogmentoContactCreatePage } from '../../src/pages/cogmento/cogmento-contact-create.page';
import { TestDataUtils } from '../../src/utils/test-data-utils';

test.describe('Cogmento - Create Contact', () => {
    test('Create a new contact with most fields', async ({ page, logger, allureReporter }) => {
        const cogmentoLoginPage = new CogmentoLoginPage(page);
        const cogmentoContactsPage = new CogmentoContactsPage(page);
        const cogmentoContactCreatePage = new CogmentoContactCreatePage(page);

        const unique = Date.now();
        const firstName = `AutoFN_${unique}`;
        const lastName = `AutoLN_${unique}`;
        const company = `AutoCompany_${unique}`;
        const email = `auto_${unique}@example.com`;
        const phoneNumber = `555${String(unique).slice(-7)}`;
        const address = `1 Automation Street ${unique}`;
        const city = 'Test City';
        const state = 'Test State';
        const zipCode = String(unique).slice(-5).padStart(5, '0');
        const country = 'Test Country';

        await allureReporter.addStep('Navigate to Cogmento login page');
        await page.goto(config.baseUrl, { waitUntil: 'load' });
        await page.waitForLoadState('networkidle');

        await allureReporter.addStep('Login to Cogmento application');
        const username = process.env.COGMENTO_USERNAME ?? TestDataUtils.getTestData('cogmento').username;
        const password = process.env.COGMENTO_PASSWORD ?? TestDataUtils.getTestData('cogmento').password;
        await cogmentoLoginPage.enterUsername(username);
        await cogmentoLoginPage.enterPassword(password);
        await cogmentoLoginPage.clickLogin();

        await allureReporter.addStep('Open Contacts');
        await cogmentoContactsPage.goToContacts();

        await allureReporter.addStep('Start create contact flow');
        await cogmentoContactsPage.openCreateContact();

        await allureReporter.addStep('Fill contact fields with unique data');
        await cogmentoContactCreatePage.createContact({
            firstName,
            lastName,
            company,
            email,
            phoneNumber,
            address,
            city,
            state,
            zipCode,
            country,
        });

        await allureReporter.addStep('Verify contact details are visible (form/result page)');
        await expect(page.getByText(firstName, { exact: false })).toBeVisible();
        await expect(page.getByText(lastName, { exact: false })).toBeVisible();
        await expect(page.getByText(email, { exact: false })).toBeVisible();

        logger.info(`Created contact: ${firstName} ${lastName} (${email})`);
    });
});
