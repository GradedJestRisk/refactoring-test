DROP FUNCTION change_user_email;
CREATE OR REPLACE FUNCTION public.change_user_email(
	p_id integer,
	p_new_email text)
    RETURNS text
    LANGUAGE 'plpgsql'
AS $BODY$DECLARE
    message TEXT;
    user_count INTEGER := 0;
    -- Constants
    USER_NOT_FOUND CONSTANT TEXT := 'user not found';
    EMAIL_TAKEN CONSTANT TEXT := 'Email is taken';
BEGIN

    RAISE NOTICE 'id : %', p_id;
    RAISE NOTICE 'email: %', p_new_email;

	SELECT COUNT(1)
	INTO user_count
	FROM "user" usr
	WHERE usr.id = p_id;

	IF user_count = 0 THEN
	    RETURN USER_NOT_FOUND;
	END IF;

	UPDATE "user"
	SET email = 'employee-one@mycorp.com'
	WHERE "user"."id" = 0;


    RETURN EMAIL_TAKEN;

END;
$BODY$;