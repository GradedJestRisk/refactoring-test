DROP FUNCTION IF EXISTS public.propagate_change();
CREATE OR REPLACE FUNCTION public.propagate_change(
    p_user_id INTEGER, p_email TEXT)
    RETURNS TEXT
    LANGUAGE 'plpgsql'
AS
$BODY$
DECLARE

    -- Variables --
    http_extension_count          INTEGER;
    message_json                  TEXT;
    response_code                 INTEGER;
    response_data                 TEXT;

    -- Constants --

    -- Return messages
    CHANGE_PROPAGATED    CONSTANT TEXT := '';
    MESSAGE_REJECTED     CONSTANT TEXT := 'Message has been rejected by http://httpbin.org/put';

BEGIN

    SELECT COUNT(1) INTO http_extension_count FROM pg_extension WHERE extname = 'http';

    IF http_extension_count = 0 THEN
        RETURN CHANGE_PROPAGATED;
    END IF;

    message_json := '{ type: ''emailChangedEvent'', userId: ''' || p_user_id || ''', email: ''' || p_email || ''' }';

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

    RETURN CHANGE_PROPAGATED;

END
$BODY$;
