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
    propagation_result            TEXT;

    -- Constants --

   -- Validation labels
    CHANGE_AUTHORIZED    CONSTANT TEXT = '';
    CHANGE_PROPAGATED    CONSTANT TEXT = '';

    -- Return message
    EXECUTION_SUCCESSFUL CONSTANT TEXT    := '';

BEGIN

    SELECT email_change_authorized(  p_user_id := p_id, p_email := p_new_email) INTO change_result;

    IF change_result <> CHANGE_AUTHORIZED THEN
        RETURN change_result;
    END IF;

    CALL update_user(p_user_id := p_id, p_email := p_new_email);

    CALL update_company();

    SELECT propagate_change(  p_user_id := p_id, p_email := p_new_email) INTO propagation_result;

    IF propagation_result <> CHANGE_PROPAGATED THEN
        RETURN propagation_result;
    END IF;

    RETURN EXECUTION_SUCCESSFUL;

END
$BODY$;