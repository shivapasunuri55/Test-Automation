import { test, expect } from '@test-setup/fixtures';
import { config } from '@config/env';
import { LoginPage } from '@/pages/login.page';
import { ContactsPage } from '@/pages/contacts.page';
import { DateUtils } from '@/utils/date-utils';
import { TestDataUtils } from '@/utils/test-data-utils';

test.describe('Contacts - Create Contact', () => {
    test('should login, create a contact, and verify it is created', async ({ page }) => {
        // Step 1: Navigate to base URL
        await page.goto(config.baseUrl);

        const loginPage = new LoginPage(page);
        const contactsPage = new ContactsPage(page);

        // Credentials: prefer test-data.json via TestDataUtils; fallback to env config if present.
        const credentials = TestDataUtils.hasTestDataKey('credentials')
            ? TestDataUtils.getTestData('credentials')
            : undefined;

        const username: string = credentials?.username ?? (config as any).credentials?.username;
        const password: string = credentials?.password ?? (config as any).credentials?.password;

        expect(username, 'Username must be provided via test-data.json (credentials.username) or config.credentials.username').toBeTruthy();
        expect(password, 'Password must be provided via test-data.json (credentials.password) or config.credentials.password').toBeTruthy();

        // Steps 1-3: Login
        await loginPage.login(username, password);

        // Step 4: Navigate to Contacts
        await contactsPage.goToContacts();

        // Step 5: Click Create
        await contactsPage.clickCreateContact();

        // Steps 6-10: Create contact
        const timestamp = DateUtils.getCurrentTimestamp();
        const contact = {
            first_name: 'Auto',
            last_name: `Contact${timestamp}`,
            company: 'Cogmento Inc',
            email_address: `auto.contact.${timestamp}@example.com`,
        };

        await contactsPage.createContact(contact);

        // Verify contact created
        await contactsPage.verifyContactCreated(contact);
    });
});
