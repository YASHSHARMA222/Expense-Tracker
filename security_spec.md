# Security Specification for Ledger App

## Data Invariants
1. A transaction must belong to a valid account and category owned by the same user.
2. An investment must belong to a valid account owned by the same user.
3. Users can only read and write their own data.
4. Timestamps (`createdAt`, `updatedAt`) must be server-generated.
5. Critical fields like `ownerId` (implicit in path) must be immutable.

## The "Dirty Dozen" Payloads
1. **Malicious ID**: Attempt to create a document with a 2KB junk string ID.
2. **Identity Spoofing**: Attempt to write to another user's subcollection using own auth.
3. **Negative Amount**: Attempt to create a transaction with a negative amount.
4. **Invalid Type**: Attempt to set account balance as a string.
5. **Ghost Fields**: Attempt to add `isAdmin: true` to a user document.
6. **Orphaned Transaction**: Create a transaction referencing a non-existent account.
7. **Future Date**: (If applicable) Setting a date 100 years in the future.
8. **Unauthorized List**: Attempt to list all transactions across all users.
9. **Zero Amount**: Transaction with 0 amount if business logic forbids it.
10. **Immutable Hijack**: Attempt to change the `startDate` of a recurring transaction after creation.
11. **Type Mismatch**: Setting `type` to `invalid_type` instead of `income` or `expense`.
12. **PII Leak**: Attempt to read user settings without being the owner.

## Test Runner Logic
The tests will verify that all unauthorized or invalid payloads result in `PERMISSION_DENIED`.
