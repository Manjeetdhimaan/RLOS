CREATE TABLE dbo.NG_RLOS_PORTAL_OTP_DETAILS
(
	insertion_order_id	BIGINT IDENTITY NOT NULL,
	first_name		   	NVARCHAR(100) NOT NULL,
	last_name		   	NVARCHAR(100) NOT NULL,
	phone_number	    NVARCHAR(20) NOT NULL,
	email              	NVARCHAR (100) NOT NULL,
	created_on         	DATETIME NULL,
	status             	NVARCHAR (100) NULL,
	otp                	NVARCHAR (8) NULL
)