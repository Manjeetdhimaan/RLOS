var express = require('express');
var MockAPIsController = require('../controllers/api-mocks');
var MockIntegrationsController = require('../controllers/integration-mocks');

var router = express.Router();

router.post('/api/applications/VALIDATE', MockAPIsController.validateApplication);
router.post('/api/applications', MockAPIsController.createApplication);
router.post('/api/applications/:arn', MockAPIsController.updateApplication);
router.get('/api/applications/:arn', MockAPIsController.getApplication);
router.get('/api/application/123456',MockAPIsController.getApplications )

//router.get('/api/application/:arn/ADDITIONALINFO', MockAPIsController.updateApplicationAdditionalInfo);

router.post('/api/applications/:arn/applicants', MockAPIsController.createApplicant);
router.post('/api/applications/:arn/applicants/:id', MockAPIsController.updateApplicant);
// router.post('/api/applications/:arn/applicants/:id/BASIC', MockAPIsController.updateApplicant);
// router.post('/api/applications/:arn/applicants/:id/ADDRESS', MockAPIsController.updateApplicant);
// router.post('/api/applications/:arn/applicants/:id/EMPLOYMENT', MockAPIsController.updateApplicant);
// router.post('/api/applications/:arn/applicants/:id/INCOME', MockAPIsController.updateApplicant);
// router.post('/api/applications/:arn/applicants/:id/ASSETS', MockAPIsController.updateApplicant);
router.delete('/api/applications/:arn/applicants/:id', MockAPIsController.deleteApplicant);

router.post('/api/applications/:arn/collateral', MockAPIsController.createOrUpdateCollateral);

router.post('/api/externalservice/documents/IDSCAN', MockIntegrationsController.invokeIDSCAN);
router.post('/api/externalservice/address/USPS', MockIntegrationsController.invokeUSPS);
router.post('/api/externalservice/vehicles/NADA', MockIntegrationsController.invokeNADA);

router.get('/api/master/:locale/:module', MockAPIsController.getMDMData);
router.get('/api/master/config', MockAPIsController.getSessionConfig);
router.post('/api/applications/:arn/applicants/:id/documents', MockAPIsController.saveDocument);
router.get('/api/applications/:arn/applicants/:id/documents', MockIntegrationsController.getImagess);
router.get('/api/applications/:arn/applicants/:id/documents/:omnidocskey', MockAPIsController.getImage);

router.post('/api/applications/:arn/PREFERENCES', MockAPIsController.putPreferences);

router.post('/api/ibps/applications', MockAPIsController.createIBPSApplication);
router.post('/api/ibps/applications/VALIDATE', MockAPIsController.validateApplication);

router.post('/api/ibps/applications/:id/config', MockAPIsController.getConfig);
router.post('/api/ibps/applications/:id/SUBMIT', MockAPIsController.submitDocuments);

// router.get('/api/ibps/applications/:id/applicants/:applicantId/documents', MockAPIsController.getDocuments);
router.post('/api/ibps/applications/:id/applicants/:applicantId/documents/:docTypeCode', MockAPIsController.saveDocument);

// router.get('/api/ibps/applications/:id/applicants/:applicantId/documents/:omnidocskey', MockAPIsController.getImage);
router.delete('/api/ibps/applications/:id/applicants/:applicantId/documents/:omnidocskey', MockAPIsController.deleteImage);

router.post('/api/externalservice/experian/questions', MockAPIsController.getExperianQuestions);

router.post('/api/externalservice/experian/answers', MockAPIsController.saveExperianAnswer);

router.get('/api/ibps/applications/:arn/loan/SNAPSHOT', MockAPIsController.getLoanData);

router.post('/api/ibps/applications/:arn/loan/CLOSINGDETAILS', MockAPIsController.submitCustomerAcceptance);


router.post('/api/applications/token/REFRESH', MockAPIsController.refreshToken);
router.get('/api/application/234567', MockAPIsController.getRLOSData);
router.post('/api/applications/:arn/applicants/:applicantId/upload', MockAPIsController.uploadDocuments);


module.exports = router;