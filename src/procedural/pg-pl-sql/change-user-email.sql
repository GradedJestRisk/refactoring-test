DROP FUNCTION IF EXISTS public.change_user_email;
CREATE OR REPLACE FUNCTION public.change_user_email(p_id integer,
                                                    p_new_email text)
    RETURNS text
    LANGUAGE 'plpgsql'
AS
$BODY$
DECLARE

    -- Variables --
    user_count                    INTEGER := 0;
    message_json                  TEXT;
    response_code                 INTEGER;
    response_data                 TEXT;

    -- Constants --

    -- Return messages
    EXECUTION_SUCCESSFUL CONSTANT TEXT    := '';
    USER_NOT_FOUND       CONSTANT TEXT    := 'user not found';
    EMAIL_ALREADY_TAKEN  CONSTANT TEXT    := 'Email is taken';
    MESSAGE_REJECTED     CONSTANT TEXT    := 'Message has been rejected by http://httpbin.org/put';

   -- Magic values
    EMPLOYEE_LABEL       CONSTANT TEXT = 'employee';

BEGIN

    -- Check if user exists
    SELECT COUNT(1)
    INTO user_count
    FROM "user" usr
    WHERE usr.id = p_id;

    IF user_count = 0 THEN
        RETURN USER_NOT_FOUND;
    END IF;

    -- Check if email is not taken yet
    SELECT COUNT(1)
    INTO user_count
    FROM "user" usr
    WHERE usr.email = p_new_email;

    IF user_count > 0 THEN
        RETURN EMAIL_ALREADY_TAKEN;
    END IF;

    -- Update user
    UPDATE "user"
    SET email = p_new_email,
        type = user_type_from_email( p_email := p_new_email)
    WHERE "user"."id" = p_id;


    -- Update employee count
    UPDATE "company"
    SET "numberOfEmployees" = (
        SELECT
            COUNT(1)
        FROM
            "user" u INNER JOIN user_type ut
                ON ut.id = u.type
        WHERE ut.label = EMPLOYEE_LABEL
    )
    WHERE "domainName" = ( SELECT "domainName" FROM company ORDER BY "domainName" LIMIT 1) ;

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
END
$BODY$;