IF OBJECT_ID ('dbo.NG_PORTAL_RESUME_OTP_EMAIL_SENDING') IS NOT NULL
	DROP PROCEDURE dbo.NG_PORTAL_RESUME_OTP_EMAIL_SENDING
GO

CREATE PROCEDURE [dbo].[NG_PORTAL_RESUME_OTP_EMAIL_SENDING]
(
	@ARN NVARCHAR(100),
	@OTP NVARCHAR(10)
)
AS
BEGIN	
	DECLARE @PROCESS_DEF_ID VARCHAR(2),
	@MAIL_FROM NVARCHAR(100),
	@MAIL_TO NVARCHAR(100),
	@MAIL_CC NVARCHAR(200),
	@MAIL_SUBJECT NVARCHAR(255),
	@MAIL_BODY NVARCHAR(MAX),
	@PRIMARY_F_NAME NVARCHAR(50), @PRIMARY_L_NAME NVARCHAR(50),
	@WI_PREFIX NVARCHAR(20),
	@PROCESS_NAME NVARCHAR(30);
	
	SELECT TOP 1 @WI_PREFIX = VALUE FROM STRING_SPLIT(@ARN, '-')
	SELECT @PROCESS_DEF_ID = ProcessDefId, @PROCESS_NAME = ProcessName  FROM PROCESSDEFTABLE WHERE RegPrefix = @WI_PREFIX
	
	SELECT @MAIL_FROM = MailFrom,
		@MAIL_TO = MailTo,
		@MAIL_SUBJECT = CommunicationSubject,
		@MAIL_BODY = CommunicationContent
	FROM NG_RLOS_EmailTemplates_Master WHERE CommunicationType = 'Resume Application' AND is_Active = 1
	
	IF (@PROCESS_NAME = 'RLOS')
	BEGIN
		SELECT @MAIL_TO = EmailAddress,
			@PRIMARY_F_NAME = FirstName,
			@PRIMARY_L_NAME = LastName
		FROM NG_RLOS_ApplicantInformation_Grid
		WHERE WIName = @ARN AND ApplicantTypePortalOnly = 'PRIMARY'
	END
	
	IF (@PROCESS_NAME = 'AO')
	BEGIN
		SELECT @MAIL_TO = EmailId,
			@PRIMARY_F_NAME = FirstName,
			@PRIMARY_L_NAME = LastName
		FROM NG_AO_IndividualApp_GRID
		WHERE Workitem_Name = @ARN AND ApplicantTypePortalOnly = 'PRIMARY'
	END
	
	SET @MAIL_BODY = replace(@MAIL_BODY, '@@Primary_First_Name@@', isnull(@PRIMARY_F_NAME,''));
	SET @MAIL_BODY = replace(@MAIL_BODY, '@@Primary_Last_Name@@', isnull(@PRIMARY_L_NAME,''));
	SET @MAIL_BODY = replace(@MAIL_BODY, '@@WI#@@', isnull(@ARN,''));
	SET @MAIL_BODY = replace(@MAIL_BODY, '@@OTP@@', isnull(@OTP,''));
	
	/* START: Trigger Email */
	INSERT INTO WFMAILQUEUETABLE(mailFrom, mailTo, mailCC, mailBCC, mailSubject,
			mailMessage, mailContentType, attachmentISINDEX, attachmentNames, AttachmentExts,
			mailPriority, mailStatus, NOOFTRIALS, INSERTEDBY, INSERTEDTIME,
			PROCESSDEFID, PROCESSINSTANCEID)
	VALUES(@MAIL_FROM, @MAIL_TO, NULL, NULL, @MAIL_SUBJECT,
			@MAIL_BODY, 'text/html;charset=UTF-8', '', '','',
			3, 'N', 0, '', CONVERT(DATETIME2(0),SYSDATETIME()),
			@PROCESS_DEF_ID, @ARN)
	/* END: Trigger Email */
END
GO