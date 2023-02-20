IF OBJECT_ID ('dbo.NG_RLOS_PORTAL_EMAIL_SENDING') IS NOT NULL
	DROP PROCEDURE dbo.NG_RLOS_PORTAL_EMAIL_SENDING
GO

CREATE PROCEDURE [dbo].[NG_RLOS_PORTAL_EMAIL_SENDING]
(
	@WI NVARCHAR(50),
	@TEMPLATE_NAME NVARCHAR(200),
	@OTHER_INFO NVARCHAR(500)
)
AS
BEGIN
	DECLARE @PROCESS_DEF_ID VARCHAR(2),
	@MAIL_FROM NVARCHAR(100),
	@MAIL_TO NVARCHAR(100),
	@MAIL_CC NVARCHAR(200),
	@MAIL_SUBJECT NVARCHAR(255),
	@MAIL_BODY NVARCHAR(MAX),
	@PRIMARY_F_NAME NVARCHAR(50), @PRIMARY_L_NAME NVARCHAR(50);
	
	SELECT @PROCESS_DEF_ID = ProcessDefId FROM PROCESSDEFTABLE WHERE ProcessName = 'RLOS';
	
	SELECT @MAIL_FROM = MailFrom,
		@MAIL_TO = MailTo,
		@MAIL_SUBJECT = CommunicationSubject,
		@MAIL_BODY = CommunicationContent
	FROM NG_RLOS_EmailTemplates_Master WHERE CommunicationType = @TEMPLATE_NAME AND is_Active = 1
	
	IF (@MAIL_TO = '<PRIMARY_EMAIL_ID>')
	BEGIN
		SELECT @MAIL_TO = EmailAddress FROM NG_RLOS_ApplicantInformation_Grid WHERE WIName = @WI AND ApplicantTypePortalOnly = 'PRIMARY'
	END
	
	/* START: Prepare Email Body */
	SELECT @PRIMARY_F_NAME = FirstName,
		@PRIMARY_L_NAME = LastName 
	FROM NG_RLOS_ApplicantInformation_Grid
	WHERE WIName = @WI AND ApplicantTypePortalOnly = 'PRIMARY'
	
	SET @MAIL_BODY = replace(@MAIL_BODY, '@@Primary_First_Name@@', isnull(@PRIMARY_F_NAME,''));
	SET @MAIL_BODY = replace(@MAIL_BODY, '@@Primary_Last_Name@@', isnull(@PRIMARY_L_NAME,''));
	
	IF (@TEMPLATE_NAME = 'Appointment Email')
	BEGIN
		DECLARE @BRANCH_NAME NVARCHAR(200),
		@BRANCH_PHONE NVARCHAR(20), @BRANCH_EMAIL NVARCHAR(20), @APPT_DATE DATETIME, @STR_DATE NVARCHAR(20),
		@START_TIME NVARCHAR(10);		
		
		SELECT @BRANCH_NAME = bm.BranchName,
			@BRANCH_PHONE = bm.BranchPhoneNumber,
			@BRANCH_EMAIL = bm.BranchEmailID,
			@APPT_DATE = convert(DATETIME,appt.APPOINTMENT_DATE, 110),
			@START_TIME = concat(appt.APPOINTMENT_HOUR, ':', appt.APPOINTMENT_TIME)
		FROM NG_RLOS_PORTAL_APPOINTMENT appt
			JOIN NG_Branch_Master bm ON bm.CODE = appt.BRANCH_CODE
		WHERE appt.WORKITEM_NAME = @WI
				
		SET @STR_DATE = CAST(month(@APPT_DATE) AS NVARCHAR) + '/' + CAST(day(@APPT_DATE) AS NVARCHAR) + '/' + CAST(year(@APPT_DATE) AS NVARCHAR);
		
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@Preferred_Branch@@', isnull(@BRANCH_NAME,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@Branch_Contact_No@@', isnull(@BRANCH_PHONE,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@Branch_Email@@', isnull(@BRANCH_EMAIL,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@DAY@@', isnull(format(@APPT_DATE, 'dddd'),''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@Appointment_Date@@', isnull(@STR_DATE,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@Start_Time@@', isnull(@START_TIME,''));
	END
	
	IF (@TEMPLATE_NAME = 'Save and Exit')
	BEGIN
		SET @MAIL_SUBJECT = replace(@MAIL_SUBJECT, '@@WI#@@', isnull(@WI,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@WI#@@', isnull(@WI,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@Resume_Link@@', isnull(@OTHER_INFO,''));
	END
	
	IF (@TEMPLATE_NAME = 'Application Initiation')
	BEGIN
		SET @MAIL_SUBJECT = replace(@MAIL_SUBJECT, '@@WI#@@', isnull(@WI,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@WI#@@', isnull(@WI,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@Resume_Link@@', isnull(@OTHER_INFO,''));
	END
	
	IF (@TEMPLATE_NAME = 'Portal Application Submission')
	BEGIN
		SET @MAIL_SUBJECT = replace(@MAIL_SUBJECT, '@@WI#@@', isnull(@WI,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@WI#@@', isnull(@WI,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@Resume_Link@@', isnull(@OTHER_INFO,''));
	END
	
	IF (@TEMPLATE_NAME = 'Resume Application')
	BEGIN
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@WI#@@', isnull(@WI,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@OTP@@', isnull(@OTHER_INFO,''));
	END
	
	IF (@TEMPLATE_NAME = 'Document Uploaded')
	BEGIN
		SELECT @MAIL_TO = LastUserEmail 
		FROM NG_FI_Email_History 
		WHERE WIName = @WI
			AND TemplateName = @TEMPLATE_NAME
		ORDER BY InsertionOrderId DESC
		
		SET @MAIL_SUBJECT = replace(@MAIL_SUBJECT, '@@WI#@@', isnull(@WI,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@WI#@@', isnull(@WI,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@Document_List@@', isnull(@OTHER_INFO,''));
	END
	
	IF (@TEMPLATE_NAME = 'Appointment Reminder email')
	BEGIN
		DECLARE @NAME_BRANCH NVARCHAR(200),
		@EMAIL_BRANCH NVARCHAR(20),
		@DATE_APPOINTMENT DATETIME,
		@DATE_STR NVARCHAR(20),
		@TIME_START NVARCHAR(10);		
		
		
	SELECT @NAME_BRANCH = bm.BranchName,
			@MAIL_TO = bm.BranchEmailID,
			@DATE_APPOINTMENT = convert(DATETIME,appt.APPOINTMENT_DATE, 110),
			@TIME_START = concat(appt.APPOINTMENT_HOUR, ':', appt.APPOINTMENT_TIME)
		FROM NG_RLOS_PORTAL_APPOINTMENT appt
			JOIN NG_Branch_Master bm ON bm.CODE = appt.BRANCH_CODE
		WHERE appt.WORKITEM_NAME = @WI
				
		SET @DATE_STR = CAST(month(@DATE_APPOINTMENT) AS NVARCHAR) + '/' + CAST(day(@DATE_APPOINTMENT) AS NVARCHAR) + '/' + CAST(year(@DATE_APPOINTMENT) AS NVARCHAR);
		
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@DAY@@', isnull(format(@DATE_APPOINTMENT, 'dddd'),'xx'));
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@Appointment_Date@@', isnull(@DATE_STR,'xx'));
		SET @MAIL_BODY = replace(@MAIL_BODY, '@@Start_Time@@', isnull(@TIME_START,'xx'));
		
	END
	
	/* END: Prepare Email Body */
	
	/* START: Trigger Email */
	INSERT INTO WFMAILQUEUETABLE(mailFrom, mailTo, mailCC, mailBCC, mailSubject,
			mailMessage, mailContentType, attachmentISINDEX, attachmentNames, AttachmentExts,
			mailPriority, mailStatus, NOOFTRIALS, INSERTEDBY, INSERTEDTIME,
			PROCESSDEFID, PROCESSINSTANCEID)
	VALUES(@MAIL_FROM, @MAIL_TO, NULL, NULL, @MAIL_SUBJECT,
			@MAIL_BODY, 'text/html;charset=UTF-8', '', '','',
			3, 'N', 0, '', CONVERT(DATETIME2(0),SYSDATETIME()),
			@PROCESS_DEF_ID, @WI)
	/* END: Trigger Email */
END
GO