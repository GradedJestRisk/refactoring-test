CREATE OR REPLACE FUNCTION public.change_user_email(
	id integer,
	newemail text)
    RETURNS text
    LANGUAGE 'plpgsql'
AS $BODY$DECLARE
    message TEXT;
BEGIN
	message := 'Email is taken';

    RAISE NOTICE 'id : %', id;
    RAISE NOTICE 'email: %', newEmail;

	UPDATE "user"
	SET email = 'employee-one@mycorp.com'
	WHERE "user"."id" = 0;

    RETURN message;

END;
$BODY$;