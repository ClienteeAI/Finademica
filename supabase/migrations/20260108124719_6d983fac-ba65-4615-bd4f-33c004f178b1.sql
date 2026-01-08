-- Clean up any trailing whitespace/CRLF characters from custom_domain values
UPDATE clients 
SET custom_domain = TRIM(BOTH FROM REPLACE(REPLACE(custom_domain, E'\r', ''), E'\n', ''))
WHERE custom_domain IS NOT NULL;