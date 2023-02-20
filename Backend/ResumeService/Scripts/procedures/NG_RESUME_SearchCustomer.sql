IF OBJECT_ID ('dbo.NG_RESUME_SearchCustomer') IS NOT NULL
	DROP PROCEDURE dbo.NG_RESUME_SearchCustomer
GO
CREATE PROCEDURE [dbo].[NG_RESUME_SearchCustomer]( 
	@ARN 		NVARCHAR(50),
	@FirstName  NVARCHAR(30),
    @LastName   NVARCHAR(63),
    @Email      NVARCHAR(50)
    --@DateOfBirth NVARCHAR(20) 
) 
AS 
BEGIN
	DECLARE @Found BIT,
	@Count INTEGER,
	@LastPage NVARCHAR(100),
	@Status NVARCHAR(100);
    SET @Found  = 0;		
	IF (@ARN like '%OAO%')
	BEGIN
		PRINT 'OAO'; 
		/*IF EXISTS(SELECT * FROM NG_AO_IndividualApp_GRID WHERE Workitem_Name = @ARN AND 
			FirstName = @FirstName AND LastName = @LastName AND EmailId = @Email 
			AND DateofBirth = @DateOfBirth)*/
		/*DECLARE 
		@LastPage NVARCHAR(100),
		@Status NVARCHAR(100);*/
		
		SELECT @Count = count(Workitem_Name)
		FROM NG_AO_IndividualApp_GRID naiag 
		where FirstName = @FirstName
			and LastName =@LastName
			--and DateofBirth = CONVERT (datetime,REPLACE(@DateOfBirth,'-','/'),111)
			and EmailId =@Email
			/*and FilledatPortal ='Yes'*/
			and ApplicantTypePortalOnly ='PRIMARY'
			and Workitem_Name = @ARN
		PRINT 'Count:';
		PRINT @Count;
		IF(@Count>0)
		BEGIN 
			SELECT @Status = STATUS , @LastPage = LAST_VISITED_PAGE FROM NG_AO_PORTAL_PREFRENCES WHERE Workitem_Name = @ARN
			PRINT 'LastPage:'+@LastPage;
			PRINT 'Status:'+@Status;
			SET @Found = 1;
		END
		ELSE
		BEGIN
			SET @Found = 0;
		END	
	END	 	
	ELSE IF(@ARN like '%RLN%')
	BEGIN
		PRINT 'RLN';
        /*IF EXISTS(SELECT * FROM NG_RLOS_ApplicantInformation_Grid WHERE WIName = @ARN 
			AND FirstName = @FirstName AND LastName = @LastName AND EmailAddress = @Email 
			AND DOB = @DateOfBirth)
		BEGIN 
			SET @Found=1  
		END*/
		/*DECLARE @Count INTEGER,
		@LastPage NVARCHAR(100),
		@Status NVARCHAR(100);*/

		SELECT @Count = count(WIName)
		FROM NG_RLOS_ApplicantInformation_Grid
		WHERE FirstName = @FirstName
			AND LastName = @LastName
			--AND DOB = convert(DATETIME, replace(@DateOfBirth,'-','/'), 111)
			AND EmailAddress = @Email
			AND FilledatPortal = 'Yes'
			AND ApplicantTypePortalOnly = 'PRIMARY'
			AND WIName = @ARN
		PRINT 'Count:';
		PRINT @Count;
		IF(@Count>0)
		BEGIN 
			SELECT @Status = STATUS, @LastPage = LAST_VISITED_PAGE  FROM NG_RLOS_PORTAL_PREFRENCES WHERE Workitem_Name = @ARN
			PRINT 'LastPage:'+@LastPage;
			PRINT 'Status:'+@Status;
			--IF(@LastPage = 'DOCUMENT')
			--BEGIN 
			--	SET @Found = 0;
			--END
			--ELSE 
			--BEGIN
			--	SET @Found = 1;
			--END
			SET @Found = 1;
		END
		ELSE
		BEGIN
			SET @Found = 0;
		END
    END
 	SELECT @Found AS 'Found'  
END
GO