# Impact Analysis Note — Contacts: Create Contact

## Why this plan step exists
The **impact_analysis** identified that there was **no existing Contacts page object or create-contact spec** in the repository. To cover the test case:

1. Login to Cogmento application
2. Click on Contacts link
3. Click on Create button
4. Create contact with most of the fields
5. Check the contact is created

…the following new automation assets were added in earlier plan steps:

- `src/pages/contacts.page.ts` — new `ContactsPage` page object
- `tests/contacts/create-contact.spec.ts` — new create-contact test spec

This documentation note exists to ensure **every impact_analysis entry is explicitly represented as a step in the plan**.

## Locator / selector risk notes
Some selectors used during initial implementation may rely on **text-based CSS patterns** (e.g., `:contains()`-style matching) or **LLM-recovered selectors** (often prefixed/annotated as `llm_recovered` in generated artifacts).

### Risks
- `:contains()` is **not standard CSS** and can be brittle or unsupported depending on selector engine usage.
- Text-based selectors can be **unstable** when UI copy changes.
- LLM-recovered selectors may be **overly specific** (deep DOM paths) and prone to break with minor UI refactors.

## Recommended future improvements
To harden the suite, replace any brittle/LLM-recovered selectors with stable Playwright locators:

- Prefer `page.getByRole(...)` for buttons/links/inputs with accessible roles
- Prefer `page.getByLabel(...)` for form fields
- Prefer `page.getByPlaceholder(...)` where appropriate

These changes should reduce flakiness and improve maintainability without changing test intent.
