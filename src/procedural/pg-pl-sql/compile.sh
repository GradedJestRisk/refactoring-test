#!/bin/bash
cd src/procedural/pg-pl-sql

psql -U postgres -d refactoring_test -h localhost -p 8432 <<HEREDOC
BEGIN;

SET client_min_messages TO WARNING;

\i user-type-from-email.sql
\i email-change-authorized.sql
\i get-execution-time.sql
\i propagate-change.sql
\i update-company.sql
\i update-user.sql
\i user-type-from-email.sql

\i change-user-email.sql

COMMIT;
HEREDOC