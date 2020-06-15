DROP PROCEDURE IF EXISTS public.update_company();
CREATE OR REPLACE PROCEDURE public.update_company()
    LANGUAGE 'plpgsql'
AS
$BODY$
DECLARE
   -- Magic values
    EMPLOYEE_LABEL       CONSTANT TEXT = 'employee';
BEGIN

    -- Update employee count
    UPDATE "company"
    SET "numberOfEmployees" = (
        SELECT
            COUNT(1)
        FROM
            "user" u INNER JOIN user_type ut
                ON ut.type = u.type
        WHERE ut.label = EMPLOYEE_LABEL
    )
    WHERE "domainName" = ( SELECT "domainName" FROM company ORDER BY "domainName" LIMIT 1) ;

END
$BODY$;
