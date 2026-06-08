# Scope: E2E Tier 3 Tests (Cross-Feature Combinations)

## Architecture
- `pytest` based testing in `F:\E-Comerce-Web\hexashop-backend\e2e_tests\`
- Test against `http://localhost:8080`
- Write pairwise combinations of features. For example, Login + Cart update, Register + Search, Category + Sort + Pagination.
- Group tests logically, e.g., `test_cross_feature_tier3.py`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Auth & Cart | Interactions between Login/Register and Cart state | none | PLANNED |
| 2 | Product Filtering | Interactions between Search, Category, Price, Sort, Pagination | none | PLANNED |
