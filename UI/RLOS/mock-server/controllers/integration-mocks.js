module.exports.invokeIDSCAN = function (request, response) {
  let mockBody = {
    "ParseImageResult": {
      "DriverLicense": {
        "Address1": "45 WESTERN AVE",
        "Address2": "",
        "Birthdate": "1963-03-26",
        "CardRevisionDate": "2021-07-21",
        "City": "WESTFIELD",
        "ClassificationCode": "D",
        "ComplianceType": " ",
        "Country": "UNITED STATES",
        "CountryCode": "USA",
        "EndorsementCodeDescription": "",
        "EndorsementsCode": "NONE",
        "ExpirationDate": "2021-03-26",
        "EyeColor": "Unknown",
        "FirstName": "CATHLEEN",
        "FullName": "CATHLEEN C BASTIBLE",
        "Gender": "Female",
        "HairColor": "",
        "Height": "068 IN",
        "IIN": "636002",
        "IssueDate": "2011-04-19",
        "IssuedBy": "MA",
        "JurisdictionCode": "MA",
        "LastName": "BASTIBLE",
        "LicenseNumber": "S318731351234567",
        "MiddleName": "C",
        "NamePrefix": "",
        "NameSuffix": "",
        "PostalCode": "01085-2614",
        "Race": "",
        "RestrictionCode": "NONE",
        "RestrictionCodeDescription": "",
        "VehicleClassCode": "D",
        "VehicleClassCodeDescription": "",
        "WeightKG": "",
        "WeightLBS": "",
        "iin": "636002"
      },
      "ErrorMessage": "OK",
      "Reference": "1D27F703DC87F716AED83E9F2AC4EA219E017FAB",
      "Success": true,
      "ValidationCode": {
        "Errors": null,
        "IsValid": true
      }
    }
  };

  return response.status(200).send(mockBody);
};

module.exports.invokeUSPS = function (request, response) {
  let mockBody = {
    "camecode": null,
    "out_CameoStatus": "ECO1",
    "out_CameoCategory": "3B",
    "out_CameoGroup": "3",
    "out_CameoInternational": "21",
    "out_CameoMVID": "94063-5596",
    "out_Cameocategorydesc": "URBAN MOVERS AND SHAKERS",
    "out_CameoInternationaldesc": "PROSPEROUS PRE-FAMILY COUPLES AND SINGLES",
    "out_CameoGroupdesc": "PROSPEROUS FAMILIES",
    "out_state": "CA",
    "out_street": "2100 SEAPORT BLVD",
    "out_city": "REDWOOD CITY",
    "out_country": "USA",
    "out_zipcode": "940636",
    "out_resuit_score": "90.09",
    "uspsaddress": "2100 SEAPORT BLVD, REDWOOD CITY CA 94063-5596, UNITED STATES",
    "success": true
  };
  return response.status(200).send(mockBody);
};

module.exports.invokeNADA = function (request, response) {
  let mockBody = {
    "success": true,
    "loanplusvinacc": "3175",
    "loanplusvinaccmileage": "3175",
    "mileageadj": "0",
    "loan": "3175",
    "retail": "5550",
    "makecode": "4",
    "bodydescr": "Sedan 4D 328i",
    "msrp": 32400,
    "makedescr": "BMW",
    "bodycode": 1137203,
    "avgtradein": "2650",
    "avemileage": 142500,
    "avgtradeinplusvinaccmileage": "2650",
    "avgtradeinplusvinacc": "2650",
    "retailplusvinacc": "5550"
  };

  return response.status(200).send(mockBody);
};


module.exports.getImagess = function (request, response) {
  let mockBody = [{
    "docTypeCode": "TAX",
    "images": [{
      "data": null,
      "ext": "JPEG",
      "name": "string",
      "omnidocsKey": "123",
      "createdOn": "ISO Date"
    }],

    "remarks": "string"

  },{
    "docTypeCode": "IDSCN",
    "images": [{
      "data": null,
      "ext": "JPEG",
      "name": "string",
      "omnidocsKey": "123",
      "createdOn": "ISO Date"
    }],

    "remarks": "string"

  },{
    "docTypeCode": "OTHER",
    "images": [{
      "data": null,
      "ext": "JPEG",
      "name": "string",
      "omnidocsKey": "123",
      "createdOn": "ISO Date"
    }],

    "remarks": "string"

  }]
  
  return response.status(200).send(mockBody);
};

