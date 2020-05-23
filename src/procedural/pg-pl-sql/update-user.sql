DROP PROCEDURE IF EXISTS public.update_user();
CREATE OR REPLACE PROCEDURE public.update_user(
    p_user_id INTEGER, p_email TEXT)
    LANGUAGE 'plpgsql'
AS
$BODY$
DECLARE
BEGIN

    UPDATE "user"
    SET email = p_email,
        type = user_type_from_email( p_email := p_email)
    WHERE "user"."id" = p_user_id;

END
$BODY$;
