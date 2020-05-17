DROP FUNCTION IF EXISTS get_execution_time_micro;
CREATE FUNCTION get_execution_time_micro() RETURNS INTEGER
    LANGUAGE PLPGSQL
AS
$$
DECLARE

    ACTUAL_EMAIL    CONSTANT TEXT    := 'employee_one@this_corp.com';
    NEW_EMAIL       CONSTANT TEXT    := 'employee-one@this_corp.com';
    EXECUTION_COUNT CONSTANT INTEGER := 10000;

    -- Loop
    before                   TIMESTAMPTZ;
    after                    TIMESTAMPTZ;
    elapsed                  INTERVAL;
    elapsed_micro            INTEGER;

    -- Global
    elapsed_micro_total      INTEGER := 0;
    elapsed_micro_average    INTEGER := 0;

BEGIN

    DELETE FROM "user" WHERE id=0;
    INSERT INTO "user" (id, email, "isEmailConfirmed", type) values (0, ACTUAL_EMAIL, true, 2);

    FOR counter IN 1..EXECUTION_COUNT
        LOOP

            UPDATE "user" SET email = ACTUAL_EMAIL WHERE id = 0;

            before := clock_timestamp();

            PERFORM change_user_email(p_id := 0, p_new_email := NEW_EMAIL);

            after := clock_timestamp();
            elapsed := after - before;

            elapsed_micro := EXTRACT(MICROSECONDS FROM elapsed);
            elapsed_micro_total = elapsed_micro_total + elapsed_micro;

        END LOOP;

    elapsed_micro_average := elapsed_micro_total / EXECUTION_COUNT;
    RETURN elapsed_micro_average;

END;
$$;
