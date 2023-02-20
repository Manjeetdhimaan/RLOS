IF OBJECT_ID ('dbo.NG_RESUME_SaveOTPDetails') IS NOT NULL
	DROP PROCEDURE dbo.NG_RESUME_SaveOTPDetails
GO

CREATE PROCEDURE [dbo].[NG_RESUME_SaveOTPDetails]
(
	@ARN as nvarchar(100),
	@CreatedOn as DATETIME2,   
	@Flag as varchar(100),
	@Otp as nvarchar(8)
)
AS    
BEGIN
	IF @Flag = 'GENERATED'
	BEGIN
		IF EXISTS(SELECT otp FROM NG_Resume_OTPDetails WHERE ARN = @ARN)
		BEGIN
			UPDATE NG_Resume_OTPDetails SET otp = @Otp,
				createdOn = @CreatedOn,
				Flag = @Flag
			WHERE ARN=@ARN
		END
		ELSE
			BEGIN
				INSERT INTO NG_Resume_OTPDetails(ARN, createdOn, Flag, otp) VALUES (@ARN, @CreatedOn, @Flag, @Otp)  
			END 
		END
	ELSE
	BEGIN
		UPDATE NG_Resume_OTPDetails SET
			flag = 'VERIFIED'
		WHERE ARN = @ARN
	END
END 
GO