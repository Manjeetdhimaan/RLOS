CREATE PROCEDURE [dbo].[NG_RLOS_PORTAL_FETCH_OTP_DETAILS]
(
	@FIRST_NAME AS NVARCHAR(100),
	@LAST_NAME AS NVARCHAR(100),
	@PHONE_NUMBER AS NVARCHAR(20),
	@EMAIL AS NVARCHAR(100)
)
AS    
BEGIN
	SELECT otp [OTP],
		concat(datepart(YEAR,created_on),'-', datepart(MONTH,created_on),'-', datepart(DAY,created_on),'-', datepart(HOUR,created_on),'-', datepart(MINUTE,created_on),'-', datepart(SECOND,created_on),'-', datepart(MILLISECOND,created_on)) [GenerationTime] 
	FROM NG_RLOS_PORTAL_OTP_DETAILS	
	WHERE first_name = @FIRST_NAME
		AND last_name = @LAST_NAME
		AND phone_number = @PHONE_NUMBER
		AND email = @EMAIL
		AND status = 'GENERATED'	
END
GO