DROP FUNCTION IF EXISTS public.change_user_email;
CREATE OR REPLACE FUNCTION public.change_user_email(p_id integer,
                                                    p_new_email text)
    RETURNS text
    LANGUAGE 'plpgsql'
AS
$BODY$
DECLARE

    -- Variables
    user_count                    INTEGER := 0;
    delta                         INTEGER := 0;
    arobase_position_in_email     INTEGER;
    email_domain_length           INTEGER;
    new_email_domain              TEXT;
    company_domain_name           TEXT;
    new_user_type                 INTEGER;
    actual_user_type              INTEGER;
    message_json                  TEXT;
    response_code                 INTEGER;
    response_data                 TEXT;

    -- Constants
    USER_NOT_FOUND       CONSTANT TEXT    := 'user not found';
    EMAIL_ALREADY_TAKEN  CONSTANT TEXT    := 'Email is taken';
    EXECUTION_SUCCESSFUL CONSTANT TEXT    := '';
    MESSAGE_REJECTED     CONSTANT TEXT    := 'Message has been rejected by http://httpbin.org/put';
    CUSTOMER_TYPE        CONSTANT INTEGER = 1;
    EMPLOYEE_TYPE        CONSTANT INTEGER = 2;

BEGIN

    -- TODO (refacto)
    --  - add database constraint to avoid employeeCount to be negative
    --  - update employeeCount using user table, not current change
    --  - create a function that checks if an email is part of the company
    --  - make all changes (email + type) to user in a single SQL statement, using previous function

    RAISE NOTICE 'p_id : %', p_id;
    RAISE NOTICE 'p_email: %', p_new_email;

    -- Does user exists ?
    SELECT COUNT(1)
    INTO user_count
    FROM "user" usr
    WHERE usr.id = p_id;

    IF user_count = 0 THEN
        RETURN USER_NOT_FOUND;
    END IF;

    -- Is email already taken ?
    SELECT COUNT(1)
    INTO user_count
    FROM "user" usr
    WHERE usr.email = p_new_email;

    IF user_count > 0 THEN
        RETURN EMAIL_ALREADY_TAKEN;
    END IF;

    -- Update user email
    UPDATE "user"
    SET email = p_new_email
    WHERE "user"."id" = p_id;

    -- Does user type changed ?
    arobase_position_in_email = position('@' IN p_new_email);
    email_domain_length = char_length(p_new_email) - arobase_position_in_email;

    RAISE NOTICE 'arobase_position_in_email : %', arobase_position_in_email;
    RAISE NOTICE 'email_domain_length : %', email_domain_length;

    new_email_domain = substring(p_new_email from (arobase_position_in_email + 1) for email_domain_length);
    RAISE NOTICE 'email_domain : %', new_email_domain;

    SELECT "domainName"
    INTO company_domain_name
    FROM company;

    RAISE NOTICE 'company_domain_name : %', company_domain_name;

    IF new_email_domain = company_domain_name THEN
        new_user_type = EMPLOYEE_TYPE;
    ELSE
        new_user_type = CUSTOMER_TYPE;
    END IF;
    RAISE NOTICE 'new user type: %s', new_user_type;

    SELECT type
    INTO actual_user_type
    FROM "user" usr
    WHERE usr.id = p_id;

    RAISE NOTICE 'actual user type: %s', actual_user_type;

    -- If so, update company employee count
    IF (actual_user_type = CUSTOMER_TYPE AND new_user_type = EMPLOYEE_TYPE) THEN
        RAISE NOTICE 'Changed from customer to employee';

        UPDATE "user"
        SET type = EMPLOYEE_TYPE
        WHERE "user"."id" = p_id;

        UPDATE "company"
        SET "numberOfEmployees" = "numberOfEmployees" + 1;

    END IF;

    IF (actual_user_type = EMPLOYEE_TYPE AND new_user_type = CUSTOMER_TYPE) THEN
        RAISE NOTICE 'Changed from employee to customer';

        UPDATE "user"
        SET type = CUSTOMER_TYPE
        WHERE "user"."id" = p_id;

        UPDATE "company"
        SET "numberOfEmployees" = "numberOfEmployees" - 1;

    END IF;

    -- Propagate changes
    message_json := '{ type: ''emailChangedEvent'', userId: ''' || p_id || ''', email: ''' || p_new_email || ''' }';

    SELECT status,
           content::json ->> 'data' AS data
    INTO
        response_code,
        response_data
    FROM
        http_put('http://httpbin.org/put', message_json, 'text/plain');

    RAISE NOTICE 'response code: %', response_code;
    RAISE NOTICE 'response data: %', response_data;

    IF response_code != 200 THEN
        RETURN MESSAGE_REJECTED;
    END IF;

    RETURN EXECUTION_SUCCESSFUL;
END;
$BODY$;