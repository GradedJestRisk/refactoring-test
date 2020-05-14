DROP FUNCTION change_user_email;
CREATE OR REPLACE FUNCTION public.change_user_email(
	id integer,
	new_email text)
    RETURNS text
    LANGUAGE 'plpgsql'
AS $BODY$DECLARE
    message TEXT;
BEGIN
	message := 'Email is taken';

    RAISE NOTICE 'id : %', id;
    RAISE NOTICE 'email: %', new_email;

	UPDATE "user"
	SET email = 'employee-one@mycorp.com'
	WHERE "user"."id" = 0;

    RETURN message;

END;
$BODY$;