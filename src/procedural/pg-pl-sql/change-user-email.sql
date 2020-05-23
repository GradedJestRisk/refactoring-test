DROP FUNCTION IF EXISTS public.change_user_email;
CREATE OR REPLACE FUNCTION public.change_user_email(p_id integer,
                                                    p_new_email text)
    RETURNS text
    LANGUAGE 'plpgsql'
AS
$BODY$
DECLARE

    -- Variables --
    change_result                 TEXT;
    message_json                  TEXT;
    response_code                 INTEGER;
    response_data                 TEXT;

    -- Constants --

    -- Return messages
    EXECUTION_SUCCESSFUL CONSTANT TEXT    := '';
    MESSAGE_REJECTED     CONSTANT TEXT    := 'Message has been rejected by http://httpbin.org/put';

   -- Magic values
    CHANGE_AUTHORIZED    CONSTANT TEXT = '';
    EMPLOYEE_LABEL       CONSTANT TEXT = 'employee';

BEGIN

    SELECT email_change_authorized(  p_user_id := p_id, p_email := p_new_email) INTO change_result;

    IF change_result <> CHANGE_AUTHORIZED THEN
        RETURN change_result;
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