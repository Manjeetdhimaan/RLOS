CREATE PROCEDURE [dbo].[NG_RLOS_PORTAL_APPOINTMENT_REMINDER]
(
	@DATE_APPOINTMENT NVARCHAR(50),
	@TEMPLATE_NAME NVARCHAR(200)
)
AS
BEGIN
	DECLARE 
	@WI NVARCHAR(20),  
	@COUNT_TOTAL INT = 0,
	@CNT INT = 1;
	BEGIN
		SET @COUNT_TOTAL = (select COUNT(*) from NG_RLOS_PORTAL_APPOINTMENT nrpa where APPOINTMENT_DATE = @DATE_APPOINTMENT );	
	while @CNT <= @COUNT_TOTAL
		BEGIN
		SELECT @WI = WORKITEM_NAME from (select ROW_NUMBER() OVER(ORDER BY INSERTION_ORDER_ID ASC) AS row_num,* from NG_RLOS_PORTAL_APPOINTMENT where APPOINTMENT_DATE = @DATE_APPOINTMENT ) Appointment where row_num = @CNT;
		
		EXEC NG_RLOS_PORTAL_EMAIL_SENDING @WI,@TEMPLATE_NAME,'';
		SET @CNT = @CNT + 1;
		END
	END
END