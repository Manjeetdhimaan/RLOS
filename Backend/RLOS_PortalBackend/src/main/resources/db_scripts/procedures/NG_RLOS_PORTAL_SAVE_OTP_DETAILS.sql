CREATE PROCEDURE [dbo].[NG_RLOS_PORTAL_SAVE_OTP_DETAILS]
(
	@FIRST_NAME AS NVARCHAR(100),
	@LAST_NAME AS NVARCHAR(100),
	@PHONE_NUMBER AS NVARCHAR(20),
	@EMAIL AS NVARCHAR(100),
	@CREATED_ON as DATETIME2,   
	@STATUS AS NVARCHAR(100),
	@OTP AS NVARCHAR(8)
)
AS    
BEGIN
	IF @STATUS = 'GENERATED'
	BEGIN
		IF EXISTS(SELECT * FROM NG_RLOS_PORTAL_OTP_DETAILS WHERE first_name = @FIRST_NAME AND last_name = @LAST_NAME AND phone_number = @PHONE_NUMBER AND email = @EMAIL)
		BEGIN
			UPDATE NG_RLOS_PORTAL_OTP_DETAILS SET 
				otp = @OTP,
				created_on = @CREATED_ON,
				status = @STATUS
			WHERE first_name = @FIRST_NAME
				AND last_name = @LAST_NAME
				AND phone_number = @PHONE_NUMBER
				AND email = @EMAIL
		END
		ELSE
		BEGIN
			INSERT INTO NG_RLOS_PORTAL_OTP_DETAILS(first_name, last_name, phone_number, email, created_on, status, otp)
			VALUES (@FIRST_NAME, @LAST_NAME, @PHONE_NUMBER, @EMAIL, @CREATED_ON, @STATUS, @OTP)  
		END		
	END
	IF @STATUS IN ('GENERATED', 'RESEND')
	BEGIN
		/* START: Trigger Email */
		DECLARE @PROCESS_DEF_ID VARCHAR(2),
		@MAIL_FROM NVARCHAR(100),
		@MAIL_SUBJECT NVARCHAR(255),
		@MAIL_BODY NVARCHAR(MAX);
		
		SELECT @PROCESS_DEF_ID = ProcessDefId FROM PROCESSDEFTABLE WHERE ProcessName = 'RLOS';		
		
		SELECT @MAIL_FROM = MailFrom,			
			@MAIL_SUBJECT = CommunicationSubject,
			@MAIL_BODY = CommunicationContent
		FROM NG_RLOS_EmailTemplates_Master WHERE CommunicationType = 'Resume Application' AND is_Active = 1
		
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@Primary_First_Name@@', isnull(@FIRST_NAME,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@Primary_Last_Name@@', isnull(@LAST_NAME,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@WI#@@', '');
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@OTP@@', isnull(@OTP,''));
		
		INSERT INTO WFMAILQUEUETABLE(mailFrom, mailTo, mailCC, mailBCC, mailSubject,
			mailMessage, mailContentType, attachmentISINDEX, attachmentNames, AttachmentExts,
			mailPriority, mailStatus, NOOFTRIALS, INSERTEDBY, INSERTEDTIME,
			PROCESSDEFID, PROCESSINSTANCEID)
		VALUES(@MAIL_FROM, @EMAIL, NULL, NULL, @MAIL_SUBJECT,
			@MAIL_BODY, 'text/html;charset=UTF-8', '', '','',
			3, 'N', 0, '', CONVERT(DATETIME2(0),SYSDATETIME()),
			@PROCESS_DEF_ID, 'NA')
		/* END: Trigger Email */
	END
	IF @STATUS = 'VERIFIED'
	BEGIN
		UPDATE NG_RLOS_PORTAL_OTP_DETAILS SET 
			status = 'VERIFIED'
		WHERE first_name = @FIRST_NAME
			AND last_name = @LAST_NAME
			AND phone_number = @PHONE_NUMBER
			AND email = @EMAIL
	END
END
GO