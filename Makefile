name: ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - name: Backend deps
        run: pip install -r backend/requirements.txt
      - name: Frontend deps
        run: pnpm --dir frontend install
      - name: Backend tests
        run: pytest -q
      - name: Frontend typecheck
        run: pnpm --dir frontend typecheck
      - name: Playwright
        run: |
          npx playwright install --with-deps
          pnpm --dir frontend build
          pnpm --dir frontend start --port 3000 &
          uvicorn backend.src.main:app --port 8000 &
          npx playwright test
