#!/bin/bash
cd src/procedural/pg-pl-sql

psql -U postgres -d refactoring_test -h localhost -p 8432 <<HEREDOC
BEGIN;

\i is-from-company.sql

\i change-user-email.sql

COMMIT;
HEREDOC