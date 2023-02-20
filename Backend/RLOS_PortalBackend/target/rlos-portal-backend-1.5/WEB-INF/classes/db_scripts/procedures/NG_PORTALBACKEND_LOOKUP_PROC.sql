IF OBJECT_ID ('dbo.NG_PORTALBACKEND_LOOKUP_PROC') IS NOT NULL
	DROP PROCEDURE dbo.NG_PORTALBACKEND_LOOKUP_PROC
GO

CREATE PROCEDURE [dbo].[NG_PORTALBACKEND_LOOKUP_PROC]
(
	@ARN NVARCHAR(100) = 'RLOS'
)
AS
BEGIN	
	---------1:Prefix-------------
	SELECT NG_CODE AS 'Code', Title AS 'Label' FROM NG_Prefix_Master WHERE IS_ACTIVE = 1 ORDER BY Label ASC

	---------2:Suffix-------------
	-- SELECT Code AS 'Code', Title AS 'Label' FROM NG_Suffix_Master order by Label asc

	---------2:Country------------- 
	SELECT NG_CODE AS 'Code', Country AS 'Label' FROM NG_Country_Master WHERE IS_ACTIVE = 1 ORDER BY(CASE WHEN NG_CODE = 'NG_14' THEN 1 when NG_CODE = 'NG_236' then 2 else 3 END ), Country
	-- NG_22 = 'The Bahamas', NG_266 = 'United States of America'

	---------3:Marital STatus------------- 
	SELECT NG_CODE AS 'Code', MaritalStatus AS 'Label' FROM NG_MaritalStatus_Master WHERE IS_ACTIVE = 1 ORDER BY Label ASC

	---------4:Identification Type------------- 
	SELECT NG_CODE AS 'Code', ID_Type AS 'Label' FROM NG_RLOS_Identification_Master WHERE IS_ACTIVE = 1
	-- SELECT DocumentCode AS 'Code',DocumentName AS 'Label' FROM NG_RLOS_Document_Master where documenttype='Identification' and isDisplayedonPortal='Y' order by Label asc
 
	---------5:Employment Type-------------
	SELECT CODE AS 'Code',EmploymentType AS 'Label' FROM NG_EmploymentType_Master WHERE IS_ACTIVE = 1 ORDER BY Label ASC

	---------6:Employment Sector-------------			
	SELECT NG_CODE AS 'Code',EmploymentSector AS 'Label' FROM NG_EmploymentSector_Master WHERE is_Active = 1 ORDER BY Label ASC

	---------7:Business Type-------------
	SELECT ID AS 'Code',BusinessType AS 'Label' FROM NG_BusinessType_Master WHERE is_Active = 1 ORDER BY Label ASC

	---------8:Income Type-------------
	SELECT CODE AS 'Code',IncomeType AS 'Label' FROM NG_IncomeType_Master WHERE is_active = 1 ORDER BY Label ASC

	---------9:Income frequency Type-------------
	SELECT CODE AS 'Code',Frequency AS 'Label' FROM NG_IncomeFrequency_Master WHERE IS_ACTIVE = 1 ORDER BY Label ASC

	--------10:PEP Relationship------------- 
	SELECT ID AS 'Code',Conditions AS 'Label' FROM NG_AO_PEPRelationship_Master WHERE is_active = 1 ORDER BY Label ASC

	---------11:Gender------------- 
	SELECT Code AS 'Code',Gender AS 'Label' FROM NG_Gender_Master WHERE IS_Active = 1 ORDER BY Label ASC

	---------12:Currency------------- 
	SELECT Code AS 'Code',Currency AS 'Label' FROM NG_Currency_Master ORDER BY Label ASC

	---------13:Family Relationship-------------
	SELECT ID AS 'Code',Relationship AS 'Label' FROM NG_FamilyRelationship_Master WHERE is_Active = 1 ORDER BY Label ASC
	
	---------14:Loan Relationship-------------
	SELECT NG_CODE AS 'Code',Applicant_Type AS 'Label' FROM NG_RLOS_LoanRelationship_Master WHERE IS_ACTIVE = 1 ORDER BY Label ASC
	
	---------15:Product Name-------------
	SELECT Loan_Type AS 'LoanType', Product_ID AS 'Code', Product_name AS 'Label' FROM NG_RLOS_Product_Master WHERE Is_Active = 1 ORDER BY Label ASC
	
	---------16:Loan Purpose/Overdraft Purpose------------- 
	SELECT NG_CODE AS 'Code', Description AS 'Label' FROM NG_RLOS_Purpose_Master WHERE is_Active = 1 ORDER BY Label ASC

	---------17:Credit Card Type------------- 
	SELECT Product_ID AS 'Code', Product_Name AS 'Label' FROM NG_RLOS_Product_Master WHERE Product_Category = 'Credit Card' AND Is_Active = 1 ORDER BY Label ASC

	---------18: Collateral------------- 
	SELECT NG_CODE AS 'Code', CollateralType AS 'Label' FROM NG_RLOS_Collateral_Master WHERE is_Active = 1 ORDER BY Label ASC
			
	---------19: Document Types ------------- 
	SELECT DocumentType AS 'Code', DocumentName AS 'Label', ApplicableFor AS 'LoanType' FROM NG_RLOS_Document_Master WHERE isActive = 1 AND isDisplayedonPortal = 'Y'

	---------20: Branch Name------------- 				
	SELECT BranchName AS 'Label', CODE AS 'Code' FROM NG_Branch_Master WHERE IS_ACTIVE = '1' AND ShowOnPortal = '1' ORDER BY CODE ASC
	
	---------21: Dependent List-------------
	SELECT ID AS 'Code', NumberOfDependents AS 'Label' FROM NG_NumberOfDependents_Master WHERE is_Active = 1
	
	---------22: Job Title -----------------
	SELECT NG_CODE AS 'Code', Title AS 'Label' FROM NG_JobTitle_Master WHERE IS_Active = 1 ORDER BY Label ASC
	
	---------23: Rent Master -----------------
	SELECT NG_CODE AS 'Code', Type AS 'Label' FROM NG_Rent_Master WHERE Is_Active = 1 ORDER BY Label ASC
	
	---------24: Asset Master -----------------
	SELECT Code AS 'Code', AssetType AS 'Label' FROM NG_RLOS_AssetType_Master WHERE Is_Active = 1 ORDER BY Label ASC
	
	---------25: Loan Products -----------------
	--SELECT Product_ID AS 'Code', Product_Name AS 'Label' FROM NG_RLOS_Product_Master WHERE Prouct_Category = 'Loans' AND Is_Active = 1 ORDER BY Label ASC
	SELECT DISTINCT Loan_Type AS 'Code', Loan_Type AS 'Label', Product_Category AS 'LoanType' FROM NG_RLOS_Product_Master
	
	---------26: Consents Text -----------------
	SELECT ID AS 'Code', Disclosures AS 'Label' FROM NG_Consents_Master WHERE Process = 'RLOS'
	
	---------27 Education Master ---------------
	SELECT NG_CODE AS 'Code', HighestEducation AS 'Label'  FROM NG_HighestEducation_Master WHERE Is_Active = 1
	
	---------28 Appointment Hours Master ---------------
	SELECT Hours AS 'Code', Hours AS 'Label'  FROM NG_AppointmentHours_Master WHERE is_Active = 1
	
	---------29 Appointment Minutes Master ---------------
	SELECT Minutes AS 'Code', Minutes AS 'Label'  FROM NG_AppointmentMinutes_Master WHERE is_Active = 1;
	
	---------30 Minimum and Maximum Age Master ---------------
	WITH DEDUPE AS (
    	SELECT  Loan_Type, Min_Age, Max_Age,
          ROW_NUMBER() OVER (PARTITION BY Loan_Type ORDER BY Loan_Type) AS OCCURENCE
    	FROM NG_RLOS_Product_Master
    )
	SELECT Loan_Type [LoanType], Min_Age [Code], Max_Age [Label] FROM DEDUPE WHERE OCCURENCE = 1
END
GO