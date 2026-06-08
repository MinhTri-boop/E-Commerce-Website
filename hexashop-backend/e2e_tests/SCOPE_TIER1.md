# Scope: E2E Tier 1 Tests (Feature Coverage)

## Architecture
- `pytest` based testing in `F:\E-Comerce-Web\hexashop-backend\e2e_tests\`
- Test against `http://localhost:8080`
- Tests should not assume the server is running yet (write the test code correctly so it passes when run).
- Group tests logically, e.g., `test_auth_tier1.py`, `test_products_tier1.py`, `test_cart_tier1.py`, etc.
- Opaque-box testing ONLY. Use `requests` to test endpoints.
- Read `F:\E-Comerce-Web\hexashop-backend\TEST_INFRA.md` for feature list.
- Read `F:\E-Comerce-Web\hexashop-backend\.agents\ORIGINAL_REQUEST.md` for requirements.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Auth Tier 1 | 5 tests per Auth feature (Register, Login, /me) | none | IN_PROGRESS |
| 2 | Products Tier 1 | 5 tests per Products feature (Search, Category, Price, Sort, Pagination, ID) | none | IN_PROGRESS |
| 3 | Cart Tier 1 | 5 tests per Cart feature (GET, POST/PUT) | none | IN_PROGRESS |

## Interface Contracts
- See `TEST_INFRA.md` and `PROJECT.md` for error format handling.
