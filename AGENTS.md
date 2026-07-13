# KYC Frontend 21 Agent Guide

## Scope

This guide applies to the Angular 21 KYC frontend application under
`frontendApplications/kyc-frontend-21/`.

## Project Shape

- Angular 21 standalone application
- TypeScript with strict compiler and strict template checks
- Zoneless change detection
- RxJS reserved for asynchronous streams such as HTTP
- Transloco is provided for the new shared layout shell
- Vitest is configured through the Angular 21 unit-test builder
- Playwright is configured for browser-level smoke tests
- Shared libraries are consumed from `../frontend-libs-21` through
  `@nexacore/*` path aliases
- Application package: `nexacore-kyc-frontend-21`

Useful commands:

```bash
npm install
npm run build
npm test
npm run test:e2e
npm start
```

## Ownership Rules

- Keep KYC, person, dashboard, profile, and app-specific API endpoint
  definitions in this application.
- Keep reusable auth, API, layout, i18n, validation, and shared UI behavior in
  `../frontend-libs-21`.
- Prefer app-specific API endpoint definitions in
  `src/app/core/api/api-endpoints.ts`.
- Prefer app-specific API services in `src/app/core/services` when the service
  belongs only to this frontend.
- Do not modify `../../v3` snapshots unless the task explicitly targets `v3`.

## Shared Library Usage

- Use `@nexacore/auth` for login, token handling, route guards, and SSO callback
  behavior.
- Use `@nexacore/layout` for the Angular 21 authenticated shell, header, rail
  navigation, layout state, theme state, and direction state.
- Use `@nexacore/api-common` for API response handling, JWT/language
  interceptors, response models, and notification abstraction.
- Use `@nexacore/shared` for reusable form controls, image preview, legacy i18n
  helpers during migration, and validation UI.
- Update `../frontend-libs-21/*/src/public-api.ts` when adding shared exports
  consumed by this app.

## Routing And Auth

- Keep public authentication routes sourced from `AUTH_ROUTES`.
- Keep authenticated app routes under the shared `LayoutComponent` route
  protected by `authGuard`.
- Do not rely on frontend route guards alone for authorization; backend APIs
  must still enforce permissions.
- Preserve the default redirect to `dashboard` unless changing the main user
  journey intentionally.

## UI And Styling

- New shell work should follow the `frontendApplications/layout` reference:
  custom SCSS tokens, CDK overlays, custom SVG icons, and dense operational UI.
- Do not add Angular Material to shared infrastructure.
- Do not add new Font Awesome or Bootstrap dependencies to the shared layout
  shell. Existing app pages may keep legacy classes until migrated.
- Keep app-level translations under `src/assets/i18n`.
- Keep generated output such as `dist/`, `.angular/`, coverage, and
  `node_modules/` out of commits.

## Testing And Verification

- Run the narrowest meaningful check before completing frontend work:

```bash
npm run build
```

- Run `npm test` when changing services, guards, shared behavior, or component
  logic with meaningful branches.
- Run Playwright checks when changing shell interactions, routing, overlays,
  language selection, or responsive layout behavior.
- If browser, dependency, network, or environment issues prevent a check, report
  the exact command and failure clearly.
