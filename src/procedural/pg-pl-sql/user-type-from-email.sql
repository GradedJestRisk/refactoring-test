DROP FUNCTION IF EXISTS public.user_type_from_email;
CREATE OR REPLACE FUNCTION public.user_type_from_email( p_email TEXT)
    RETURNS INTEGER
    LANGUAGE 'plpgsql'
AS
$BODY$
DECLARE

    -- Magic values
    CUSTOMER_LABEL       CONSTANT TEXT = 'customer';
    EMPLOYEE_LABEL       CONSTANT TEXT = 'employee';

    -- Variables
    user_type_id    INTEGER;

    arobase_position_in_email     INTEGER;
    email_domain_length           INTEGER;
    new_email_domain              TEXT;
    company_domain_name           TEXT;

BEGIN

    arobase_position_in_email := position('@' IN p_email);
    email_domain_length := char_length(p_email) - arobase_position_in_email;
    new_email_domain := substring(p_email from (arobase_position_in_email + 1) for email_domain_length);

    SELECT "domainName"
    INTO company_domain_name
    FROM company;

    IF new_email_domain = company_domain_name THEN
        SELECT id INTO user_type_id FROM user_type WHERE label = EMPLOYEE_LABEL;
    ELSE
        SELECT id INTO user_type_id FROM user_type WHERE label = CUSTOMER_LABEL;
    END IF;

    RETURN user_type_id;

END
$BODY$;