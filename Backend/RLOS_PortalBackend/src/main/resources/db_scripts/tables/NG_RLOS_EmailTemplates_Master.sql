/* START: Moved in SIT*/ 
UPDATE NG_RLOS_EmailTemplates_Master SET 
	CommunicationContent = '<p>Dear <b>@@Primary_First_Name@@ @@Primary_Last_Name@@,</b>,<br><br>Thank You for choosing Commonwealth Bank Ltd.<br><br>You will be contacted within 24 hours to confirm your preferred time with <b>@@Preferred_Branch@@</b> for <b>@@DAY@@</b>, <b>@@Appointment_Date@@</b> at <b>@@Start_Time@@</b> hours.<br><br>Kindly contact <b>@@Preferred_Branch@@</b> at @@Branch_Contact_No@@ , email at <a href="@@Branch_Email@@" target="_blank">@@Branch_Email@@</a> if the scheduled time is not convenient, you may arrange an alternative date and time with.<br><br>Note: This is a system generated email. Please do not reply.<br><br><b>Kind Regards</b>,<br>Commonwealth Bank</p>' 
WHERE CommunicationType = 'Appointment Email'
GO

UPDATE NG_RLOS_EmailTemplates_Master SET
	CommunicationSubject =  'Application # @@WI#@@ is saved to Resume Later',
	CommunicationContent = '<p>Dear <b>@@Primary_First_Name@@ @@Primary_Last_Name@@,</b><br><br> We have saved your loan application # <b>@@WI#@@</b> Please use the below link to resume again from same section where left off and submit the filled applicant.<br><br> <a href="@@Resume_Link@@" target="_blank">@@Resume_Link@@</a> <br><br>Note: This is a system generated email. Kindly do not reply.<br><br><b>Kind Regards</b>,<br>Commonwealth Bank</p>',
	MailCC = NULL
WHERE CommunicationType = 'Save and Exit'
GO

UPDATE NG_RLOS_EmailTemplates_Master SET
	CommunicationSubject = 'Loan Application # @@WI#@@ Initiated',
	CommunicationContent = '<p>Dear <b>@@Primary_First_Name@@ @@Primary_Last_Name@@,</b><br><br>Your Loan Application with application # <b>@@WI#@@</b> has been successfully initiated. Please complete the rest of mentioned details and submit the application. Below is the link to check the status.<br><br> <a href="@@Resume_Link@@" target="_blank">@@Resume_Link@@</a>.<br></br> This link can also be used to resume the unfinished application from where left off.<br><br> Note: This is a system generated email. Kindly do not reply.<br><br><b>Kind Regards</b>,<br>Commonwealth Bank</p>',
	Trigger_WorkstepName = 'Portal - After submission confirmation on Basic details page/When WI has been created'
WHERE CommunicationType = 'Application Initiation'
GO

UPDATE NG_RLOS_EmailTemplates_Master SET
	CommunicationSubject = 'Loan Application # @@WI#@@ successfully submitted',
	CommunicationContent = '<p>Dear <b>@@Primary_First_Name@@ @@Primary_Last_Name@@,</b><br><br>Your loan application with application # <b>@@WI#@@</b> has been successfully submitted with bank. We will update you shortly post our review. Below is the link to check the status.<br><br> <a href="@@Resume_Link@@" target="_blank">@@Resume_Link@@</a><br><br>Note: This is a system generated email. Kindly do not reply.<br><br><b>Kind Regards</b>,<br>Commonwealth Bank</p>',
	MailCC = NULL
WHERE CommunicationType = 'Portal Application Submission'

UPDATE NG_RLOS_EmailTemplates_Master SET
	CommunicationContent = '<p>Dear <b>@@Primary_First_Name@@ @@Primary_Last_Name@@,</b><br><br>  Below is the 6 digit OTP for validating your application # <b>@@WI#@@</b>. Please fill this OTP on the application to proceed further.<br><br><b>@@OTP@@</b><br><br><b>Kind Regards,</b><br>Commonwealth Bank.</p>',
	MailTo = '<PRIMARY_EMAIL_ID>'
WHERE CommunicationType = 'Resume Application'
GO
/* END: Moved in SIT*/
UPDATE NG_RLOS_EmailTemplates_Master SET
	CommunicationSubject = 'Document Uploaded for Loan Application Number @@WI#@@',
	CommunicationContent = '<p>Hi,<br>  Below documents have been uploaded in the application # @@WI#@@.<br>@@Document_List@@<br>Kindly log in back office portal to review the same.</p>',
	MailTo = '<LAST_DOC_REQUESTED_BY_EMAIL_ID>'
WHERE CommunicationType = 'Document Uploaded'
GO

UPDATE NG_RLOS_EmailTemplates_Master SET 
	CommunicationContent = '<p>Dear <b>@@Primary_First_Name@@ @@Primary_Last_Name@@,</b>,<br><br>Thank You for choosing Commonwealth Bank Ltd.<br><br>You will be contacted within 24 hours to confirm your preferred time with <b>@@Preferred_Branch@@</b> for <b>@@DAY@@</b>, <b>@@Appointment_Date@@</b> at <b>@@Start_Time@@</b> hours.<br><br>Kindly contact <b>@@Preferred_Branch@@</b> at @@Branch_Contact_No@@ , email at <a href="@@Branch_Email@@" target="_blank">@@Branch_Email@@</a> if the scheduled time is not convenient, you may arrange an alternative date and time with.<br><br>Note: This is a system generated email. Please do not reply.<br><br><b>Kind Regards</b>,<br>Commonwealth Bank</p>' 
WHERE CommunicationType = 'Appointment Email'
GO