# Top 3 Risks + Mitigations

1. Access control leaks across buyers.
   - Mitigation: enforce BuyerAccess filtering in every buyer-facing endpoint and add unit tests.
2. Pack generation delays or failures.
   - Mitigation: async job retries, status tracking, and alerting on stuck jobs.
3. Evidence version drift (wrong version shared).
   - Mitigation: immutable version IDs, audit logs, and explicit version selection at fulfill time.
