IF OBJECT_ID ('dbo.NG_RESUME_FetchOTPDetail') IS NOT NULL
	DROP PROCEDURE dbo.NG_RESUME_FetchOTPDetail
GO

CREATE PROCEDURE [dbo].[NG_RESUME_FetchOTPDetail](
	@ARN nvarchar(20)
)
AS    
BEGIN
	SELECT ARN,
		concat(datepart(YEAR,createdOn),'-', datepart(MONTH,createdOn),'-', datepart(DAY,createdOn),'-', datepart(HOUR,createdOn),'-', datepart(MINUTE,createdOn),'-', datepart(SECOND,createdOn),'-', datepart(MILLISECOND,createdOn)) [createdOn],
		Flag, otp
	FROM NG_Resume_OTPDetails 
	WHERE ARN = @ARN
END
GO