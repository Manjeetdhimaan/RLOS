IF OBJECT_ID ('dbo.NG_RLOS_PORTAL_EMAIL_APPOINTMENT') IS NOT NULL
	DROP PROCEDURE dbo.NG_RLOS_PORTAL_EMAIL_APPOINTMENT
GO

CREATE PROCEDURE [dbo].[NG_RLOS_PORTAL_EMAIL_APPOINTMENT]
(
	@ARN NVARCHAR(50),
	@BRANCH_CODE NVARCHAR(50),
	@APPT_DATE NVARCHAR(10),--YYYY-MM-DD
	@APPT_HOUR NVARCHAR(2),
	@APPT_TIME NVARCHAR(2)
)
AS
BEGIN	
	PRINT 'Email for Schedule Appointment'
	DECLARE @COUNT INT;
	SELECT @COUNT = COUNT(*) FROM NG_RLOS_PORTAL_APPOINTMENT WHERE WORKITEM_NAME = @ARN
	IF @COUNT = 0
	BEGIN
		INSERT INTO NG_RLOS_PORTAL_APPOINTMENT(WORKITEM_NAME, BRANCH_CODE, APPOINTMENT_DATE, APPOINTMENT_HOUR, APPOINTMENT_TIME)
		VALUES(@ARN, @BRANCH_CODE, @APPT_DATE, @APPT_HOUR, @APPT_TIME)
		
		/*DECLARE @MAIL_FROM NVARCHAR(100), @MAIL_TO NVARCHAR(100), @MAIL_SUBJECT NVARCHAR(255), @MAIL_BODY NVARCHAR(MAX),
		@FNAME NVARCHAR(50), @LNAME NVARCHAR(50), @BRANCH NVARCHAR(200), @BRANCH_CONTACT NVARCHAR(14), @BRANCH_EMAIL NVARCHAR(14),
		@APPT_DATE1 DATETIME, @STR_DATE NVARCHAR(20);
		
		SELECT @MAIL_FROM = MailFrom,
			@MAIL_SUBJECT = CommunicationSubject,
			@MAIL_BODY = CommunicationContent
		FROM NG_RLOS_EmailTemplates_Master WHERE CommunicationType = 'Appointment Email' AND is_Active = 1
		
		SELECT @FNAME = FirstName, @LNAME = LastName, @MAIL_TO = EmailAddress FROM NG_RLOS_ApplicantInformation_Grid WHERE WIName = @ARN AND ApplicantTypePortalOnly = 'PRIMARY'
		SELECT @BRANCH = BranchName, @BRANCH_CONTACT = BranchPhoneNumber, @BRANCH_EMAIL = BranchEmailID FROM NG_Branch_Master WHERE CODE = @BRANCH_CODE
		SELECT @APPT_DATE1 = convert(DATETIME,@APPT_DATE, 110)
		SET @STR_DATE = CAST(month(@APPT_DATE1) AS NVARCHAR) + '/' + CAST(day(@APPT_DATE1) AS NVARCHAR) + '/' + CAST(year(@APPT_DATE1) AS NVARCHAR);
		
		SET @MAIL_BODY = replace(@MAIL_BODY, '&lt;First_Name&gt;', isnull(@FNAME,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '&lt;Last_Name&gt;', isnull(@LNAME,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '&lt;Preferred Branch&gt;', isnull(@BRANCH,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '&lt;DAY&gt;', isnull(format(@APPT_DATE1, 'dddd'),''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '&lt;date of appointment&gt;', isnull(@STR_DATE,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '&lt;starttime&gt;', isnull(@APPT_HOUR + ':' + @APPT_TIME,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '&lt;date of appointment&gt;', isnull(@STR_DATE,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '&lt;Preferred branch&gt;', isnull(@BRANCH,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '&lt;Branch contact&gt;', isnull(@BRANCH_CONTACT,''));
		SET @MAIL_BODY = replace(@MAIL_BODY, '&lt;branch email&gt;', isnull(@BRANCH_EMAIL,''));
		
		INSERT INTO WFMAILQUEUETABLE(mailFrom, mailTo, mailCC, mailBCC, mailSubject,
			mailMessage, mailContentType, attachmentISINDEX, attachmentNames, AttachmentExts,
			mailPriority, mailStatus, NOOFTRIALS, INSERTEDBY, INSERTEDTIME,
			PROCESSDEFID, PROCESSINSTANCEID)
		VALUES(@MAIL_FROM, @MAIL_TO, NULL, NULL, @MAIL_SUBJECT,
			@MAIL_BODY, 'text/html;charset=UTF-8', '', '','',
			1, 'N', 0, '', CONVERT(DATETIME2(0),SYSDATETIME()),
			'', @ARN)*/
		EXEC NG_RLOS_PORTAL_EMAIL_SENDING @ARN, 'Appointment Email', '';
	END
	SELECT @COUNT AS [STATUS]
END

GO