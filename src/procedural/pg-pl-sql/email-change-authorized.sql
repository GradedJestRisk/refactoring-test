DROP FUNCTION IF EXISTS public.email_change_authorized;
CREATE OR REPLACE FUNCTION public.email_change_authorized(
    p_user_id INTEGER, p_email TEXT)
    RETURNS TEXT
    LANGUAGE 'plpgsql'
AS
$BODY$
DECLARE

    -- Variables --
    user_count                    INTEGER := 0;

    -- Constants --

    -- Return messages
    CHANGE_AUTHORIZED    CONSTANT TEXT    := '';
    USER_NOT_FOUND       CONSTANT TEXT    := 'user not found';
    EMAIL_ALREADY_TAKEN  CONSTANT TEXT    := 'Email is taken';

BEGIN

    -- Check if user exists
    SELECT COUNT(1)
    INTO user_count
    FROM "user" usr
    WHERE usr.id = p_user_id;

    IF user_count = 0 THEN
        RETURN USER_NOT_FOUND;
    END IF;

    -- Check if email is not taken yet
    SELECT COUNT(1)
    INTO user_count
    FROM "user" usr
    WHERE usr.email = p_email;

    IF user_count > 0 THEN
        RETURN EMAIL_ALREADY_TAKEN;
    END IF;

    RETURN CHANGE_AUTHORIZED;

END
$BODY$;
