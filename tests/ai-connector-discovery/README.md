AI Connector Discovery — Test Stubs

This repository does not declare a front-end test runner by default. The files in this folder are lightweight stubs you can enable with your preferred tooling.

Options
- React Testing Library (Jest or Vitest): run unit/component tests in JSDOM.
- Playwright: run UI smoke tests against a Storybook instance or app page.

Quick Start (Jest + RTL)
1) Add dev deps:
   - jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom jsdom typescript
2) Configure Jest (jsdom env) and ts-jest transformer.
3) Unskip the tests in `ai-connector-discovery.test.tsx`.

Quick Start (Vitest + RTL)
1) Add dev deps:
   - vitest @testing-library/react @testing-library/jest-dom jsdom typescript
2) Configure Vitest with environment `jsdom`.
3) Unskip the tests in `ai-connector-discovery.test.tsx`.

Playwright (optional)
- Launch your app or Storybook, then point Playwright at the running URL.
- You can adapt these tests to open the Storybook story `Features/AI Connector Discovery`.

Notes
- Tests are dependency-free stubs by default; they will not run until tooling is installed.
- Keep tests isolated from network and use mock adapters provided by the feature.

