# Impact Analysis Note — Contacts: Create Contact

## Summary
The `impact_analysis` identified that there was **no existing Contacts page object or create-contact spec** in the repository. To cover the test case:

1. Login to Cogmento application.
2. Click on Contacts link
3. Click on Create button
4. Create contact with most of the fields.
5. Check the contact is created

…the following new automation assets were added:

- **Page objects**
  - `src/pages/login.page.ts`
  - `src/pages/contacts.page.ts`
- **Test spec**
  - `tests/contacts/create-contact.spec.ts`

This documentation step exists to ensure **every `impact_analysis` entry is represented as an explicit step in the plan**.

## Locator / Selector Risk Notes
Some selectors used during initial implementation may rely on less-stable patterns (e.g., `:contains()`-style text matching or `llm_recovered` selectors).

Risks:
- Text-based pseudo-selectors like `:contains()` are **not standard CSS** and can be brittle depending on the selector engine.
- `llm_recovered` selectors are typically **generated from DOM snapshots** and may change frequently with UI updates.

## Future Improvements (Recommended)
Replace any `llm_recovered` and `:contains()`-style selectors with stable Playwright locators:

- Prefer `page.getByRole(...)` for buttons/links/inputs with accessible roles.
- Prefer `page.getByLabel(...)` for form fields.
- Prefer `page.getByPlaceholder(...)` where labels are not available.

Goal: improve resilience and reduce maintenance by aligning selectors with accessibility attributes and stable UI semantics.
