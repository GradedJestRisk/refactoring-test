DROP FUNCTION IF EXISTS public.is_from_company;
CREATE OR REPLACE FUNCTION public.is_from_company( p_email TEXT)
    RETURNS BOOLEAN
    LANGUAGE 'plpgsql'
AS
$BODY$
DECLARE

    -- Variables
    is_from_company    BOOLEAN;

    arobase_position_in_email     INTEGER;
    email_domain_length           INTEGER;
    new_email_domain              TEXT;
    company_domain_name           TEXT;

BEGIN
    -- Does user type changed ?
    arobase_position_in_email := position('@' IN p_email);
    email_domain_length := char_length(p_email) - arobase_position_in_email;
    new_email_domain := substring(p_email from (arobase_position_in_email + 1) for email_domain_length);

    SELECT "domainName"
    INTO company_domain_name
    FROM company;

    IF new_email_domain = company_domain_name THEN
        is_from_company = TRUE;
    ELSE
        is_from_company = FALSE;
    END IF;

    RETURN is_from_company;

END;
$BODY$;