# Scope: E2E Tier 2 Tests (Boundary & Corner Cases)

## Architecture
- `pytest` based testing in `F:\E-Comerce-Web\hexashop-backend\e2e_tests\`
- Test against `http://localhost:8080`
- Write boundary/corner cases: empty inputs, missing fields, invalid tokens, extreme prices, non-existent categories, invalid IDs.
- Group tests logically, e.g., `test_auth_tier2.py`, `test_products_tier2.py`, `test_cart_tier2.py`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Auth Tier 2 | 5 boundary tests per Auth feature | none | DONE |
| 2 | Products Tier 2 | 5 boundary tests per Products feature | none | DONE |
| 3 | Cart Tier 2 | 5 boundary tests per Cart feature | none | DONE |
