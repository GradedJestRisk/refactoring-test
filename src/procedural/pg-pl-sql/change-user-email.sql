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
    --  - make all changes (email + type) to user in a single SQL statement, using previous function

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


    IF is_from_company(p_email := p_new_email) THEN
        new_user_type = EMPLOYEE_TYPE;
    ELSE
        new_user_type = CUSTOMER_TYPE;
    END IF;

    SELECT type
    INTO actual_user_type
    FROM "user" usr
    WHERE usr.id = p_id;


    IF (actual_user_type = CUSTOMER_TYPE AND new_user_type = EMPLOYEE_TYPE) THEN

        UPDATE "user"
        SET type = EMPLOYEE_TYPE
        WHERE "user"."id" = p_id;

    END IF;

    IF (actual_user_type = EMPLOYEE_TYPE AND new_user_type = CUSTOMER_TYPE) THEN

        UPDATE "user"
        SET type = CUSTOMER_TYPE
        WHERE "user"."id" = p_id;

    END IF;

   -- Keep company count up-to-date
    UPDATE "company"
    SET "numberOfEmployees" = (
        SELECT
            COUNT(1)
        FROM
            "user" u INNER JOIN user_type ut
                ON ut.id = u.type
        WHERE ut.label = 'employee'
        );

    -- Propagate changes (deactivated by default, as most PostgreSQL setup do not include http extension)
/*    message_json := '{ type: ''emailChangedEvent'', userId: ''' || p_id || ''', email: ''' || p_new_email || ''' }';

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
    END IF;*/

    RETURN EXECUTION_SUCCESSFUL;
END;
$BODY$;